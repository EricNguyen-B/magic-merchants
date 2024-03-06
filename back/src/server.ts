import express, { application, Response } from "express";
// import { z } from "zod";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { v4 as uuid } from 'uuid';
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import * as dotenv from 'dotenv';
import * as schemas from "./schemas.js";
import { AuctionEventScheduler } from "./schedules.js";

dotenv.config({path: '../.env'});
sqlite3.verbose(); 
const db = await open({
    filename: "../database.db",
    driver: sqlite3.Database,
});

const app = express();
const server = http.createServer(app);
const allowedOrigins = ["http://localhost:5173", process.env.CORS_ORIGIN];
const io = new Server(server, {
    cors: {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }else {
            callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ["GET", "POST"]
  }
});
app.use(cors());
app.use(express.json({ limit: "1kb" }));
const auctionEventScheduler = new AuctionEventScheduler(db, io);
auctionEventScheduler.onStartScheduleEvents();

/**Websocket Event Handlers**/
async function handleSendBidEvent(data:any, socket: Socket) {
  try{
    const {price, auction_id} = data;
    const newBidId = uuid();
    await db.run('INSERT INTO user_bid(id, auction_id, price) VALUES (?, ?, ?)', [newBidId, auction_id, price]);
    io.to(auction_id).emit("recieved_bid", {bid_price: price}); 
    io.emit(`${auction_id}/recieved_bid`, {bid_price: price});
  }catch(error){
    console.log("Failed to send bid");
  }
}
async function handleJoinRoomEvent(data: any, socket: Socket) {
  try {
    const {auction_id} = data;
    socket.join(auction_id);
    const room = io.sockets.adapter.rooms.get(auction_id);
    io.to(auction_id).emit("joined_room", {viewer_count: room?.size});
    io.emit(`${auction_id}/view_count`, {viewer_count: room?.size});
  } catch (error) {
    console.log("Failed to join room");
  }
}

async function handleJoinChatRoomEvent(data: any, socket: Socket) {
  try {
      const { auction_id } = data;
      console.log(`User ${socket.id} joined chat room: ${auction_id}`);
      socket.join(auction_id);
      // Emit message to all clients in the room, including the sender
      io.to(auction_id).emit("user_joined", `User ${socket.id} joined chat room: ${auction_id}`);
  } catch (error) {
      console.log("Failed to join chat room", error);
async function handleExitRoomEvent(data: any, socket: Socket) {
  try {
    const {auction_id} = data;
    socket.leave(auction_id);
    const room = io.sockets.adapter.rooms.get(auction_id);
    io.to(auction_id).emit("exited_room", {viewer_count: room?.size});
    io.emit(`${auction_id}/view_count`, {viewer_count: room?.size});
  } catch (error) {
    console.log(error)
    console.log("Failed to exit room");
  }
}
async function handleViewerCountEvent(data: any, socket: Socket){
  try {
    const {auction_id} = data;
    const room = io.sockets.adapter.rooms.get(auction_id);
    io.emit(`${auction_id}/view_count`, {viewer_count: room?.size});
  } catch (error) {
    console.log(error)
    console.log("Failed to count viewers");
  }
}

async function handleSendMessageEvent(data: any, socket: Socket) {
  try {
      console.log("message sent");
      const { text_message, auction_id } = data;
      console.log(text_message);
      const newMessageId = uuid();
      await db.run('INSERT INTO chat_messages (message_id, text_message, auction_id) VALUES (?, ?, ?)', [newMessageId, text_message, auction_id]);
      io.to(auction_id).emit("received_message", { message_id: newMessageId, text_message, auction_id });
  } catch (error) {
      console.log("Failed to send message", error);
  }
}



/**Websocket Event Listeners**/
io.on("connection", (socket) => { 
  socket.on("joining_room", (data) => {
    handleJoinRoomEvent(data, socket);
  });
  socket.on("exiting_room", (data) => {
    handleExitRoomEvent(data, socket);
  });
  socket.on("sending_bid", (data) => {
    handleSendBidEvent(data, socket);
  })
  socket.on("join_chat_room", (data) =>{ 
    handleJoinChatRoomEvent(data, socket)
  });
  socket.on("send_message", (data) =>{ 
    handleSendMessageEvent(data, socket)
  });
  socket.on("getting_viewer_count", (data) => {
    handleViewerCountEvent(data, socket);
  });
})
// TO DO: resolve errors with useEffect hook checking active rooms on the main page
app.get("/api/chat-history/:auctionId", async (req, res) => {
  try {
      const { auctionId } = req.params;
      const messages = await db.all("SELECT * FROM chat_messages WHERE auction_id = ?", auctionId);
      res.json(messages);
  } catch (error) {
      console.error("Failed to fetch chat history", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

app.get("/api/check-active-rooms", async (req, res) => {
  let result;
  try {
    result = await db.all("SELECT * FROM auction_room");
    res.json(result);
  } catch (error) {
      console.error("Failed to check for all auction rooms", error);
      res.status(500).json({ error: "Failed to check active auction rooms" });
  }
})

app.post("/api/add-auction", async (req, res) => {
    const sqlCreateAuctionQuery = 
      `INSERT INTO auction_room 
      (id, card_name, card_condition, date_start, date_end, min_bid_price, min_bid_increments) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    try {
      /**Validate Request Schema**/
      const {dateStart, dateEnd, cardName, cardCondition, minBidPrice, minBidIncrement} = schemas.auctionSchema.parse(req.body);
      /**generate Auction ID**/
      const auctionID = uuid();
      /**Run Auction Query and Then Schedule Event**/
      await db.run(sqlCreateAuctionQuery, [auctionID, cardName, cardCondition, dateStart, dateEnd, minBidPrice, minBidIncrement])
        .then(() => {
          auctionEventScheduler.scheduleEvent(auctionID, dateStart, dateEnd);
        });
      /**Return a Success Message**/
      res.status(200).json({message: "Success", auction: req.body});
    } catch (error) {
      res.status(500).json({ error: "Failed to add auction room" });
    }
});

app.get("/api/check-bid-history/:auctionId", async (req, res) => {
  const sqlGetBidHistory = 'SELECT * FROM user_bid WHERE auction_id = ?'
  try {
    const { auctionId } = req.params;
    const result = await db.all(sqlGetBidHistory, [auctionId]);
    res.json(result);
  } catch (error) {
    console.error("Failed to check bid history with auction ID", error);
    res.status(500).json({ error: "Failed to check bid history" });
  }
});

app.get("/api/check-top-bids", async (req, res) => {
  const sqlGetTopBids = 'SELECT id, auction_id, MAX(price) AS price FROM user_bid GROUP BY auction_id';
  try {
    const result = await db.all(sqlGetTopBids);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to check bid history" });
  }
});

server.listen(3000, () => {
  console.log(`http://localhost:3000`);
});
