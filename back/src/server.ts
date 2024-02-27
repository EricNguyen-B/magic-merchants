import express, { application, Response } from "express";
import { z } from "zod";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { v4 as uuid } from 'uuid';
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import * as dotenv from 'dotenv';
import * as schemas from "./schemas.js";
import { scheduleAuctionEvent } from "./schedules.js";

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

/**Websocket Event Handlers**/
async function handleSendBidEvent(data:any, socket: Socket) {
  try{
    const {price, auction_id} = data;
    const newBidId = uuid();
    await db.run('INSERT INTO user_bid(id, auction_id, price) VALUES (?, ?, ?)', [newBidId, auction_id, price]);
    io.to(auction_id).emit("recieved_bid", data); 
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
  } catch (error) {
    console.log("Failed to join room");
  }
}
async function handleExitRoomEvent(data: any, socket: Socket) {
  try {
    const {auction_id} = data;
    socket.leave(auction_id);
    const room = io.sockets.adapter.rooms.get(auction_id);
    socket.to(auction_id).emit("exited_room", {viewer_count: room?.size});
  } catch (error) {
    console.log(error)
    console.log("Failed to exit room");
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
  });
})
// TO DO: resolve errors with useEffect hook checking active rooms on the main page
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
          scheduleAuctionEvent(auctionID, dateStart, dateEnd, db, io);
        });
      /**Return a Success Message**/
      res.status(200).json({message: "Success", auction: req.body});
    } catch (error) {
      res.status(500).json({ error: "Failed to add auction room" });
    }
});

app.get("/api/check-bid-history/:auctionId", async (req, res) => {
  let result;
  try {
    const { auctionId } = req.params;
    // console.log(auctionId);
    result = await db.all("SELECT * FROM user_bid WHERE auction_id = ?", [auctionId]);
    res.json(result);
  } catch (error) {
    console.error("Failed to check bid history with auction ID", error);
    res.status(500).json({ error: "Failed to check bid history" });
  }
});

server.listen(3000, () => {
  console.log(`http://localhost:3000`);
});
