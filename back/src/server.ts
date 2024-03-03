import express, { application, Response } from "express";
import { z } from "zod";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { v4 as uuid } from 'uuid';
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const port = 3000;
const host = "localhost";
const protocol = "http";

sqlite3.verbose(); // enable better error messages
const db = await open({
    filename: "../database.db",
    driver: sqlite3.Database,
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Allow requests from client
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
    // socket.to(auction_id).emit("recieved_bid", data);
    io.to(auction_id).emit("recieved_bid", data); //Sends to everyone in the room including sender
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
    //console.log(`User ${socket.id} joined Room: ${auction_id} | Room has ${room?.size}`);
  } catch (error) {
    console.log("Failed to join room");
  }
}
async function chatDisplay(data: any, socket: Socket) {
  try {

  } catch (error) {

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

// async function handleJoinChatRoomEvent(data: any, socket: Socket) {
//   try {
//       const { roomId } = data;
//       socket.join(roomId);
//       const room = io.sockets.adapter.rooms.get(roomId);
//       console.log(`User ${socket.id} joined chat room: ${roomId}`);
//   } catch (error) {
//       console.log("Failed to join chat room", error);
//   }
// }

async function handleLeaveRoomEvent(data: any, socket: Socket) {
  
}
/**Websocket Event Listeners**/
io.on("connection", (socket) => { 
  //console.log(`User Connected: ${socket.id}`);
  socket.on("joining_room", (data) => {
    handleJoinRoomEvent(data, socket);
  })
  socket.on("sending_bid", (data) => {
    handleSendBidEvent(data, socket);
  })
  // socket.on("join_chat_room", (data) =>{ 
  //   handleJoinChatRoomEvent(data, socket)
  // });
  socket.on("send_message", (data) =>{ 
    handleSendMessageEvent(data, socket)
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
    try {
        console.log("added auction");
        const newAuctionId = uuid();
        await db.run('INSERT INTO auction_room (id) VALUES (?)', newAuctionId);
        res.json({ id: newAuctionId });
    } catch (error) {
      console.error("Failed to add auction room:", error);
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

server.listen(port, () => {
  console.log(`${protocol}://${host}:${port}`);
});
