import express, { application, Response } from "express";
import { z } from "zod";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { v4 as uuid } from 'uuid';
import http from "http";
import { Server } from "socket.io";
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

io.on("connection", (socket) => { //Listen to connection events
  console.log(`User Connected: ${socket.id}`);
  socket.on("send_bid", async (data) => {
    console.log(`User ${socket.id} placed a bid:  ${data}`);
    //Store bid into table
    try{
      const {price, auction_id} = data;
      const newBidId = uuid();
     
      await db.run('INSERT INTO user_bid(id, auction_id, price) VALUES (?, ?, ?)', [newBidId, auction_id, price]);
      const result = await db.all('SELECT * FROM user_bid');
      console.log(result);
      
    }catch(error){
      console.log("Bid failed");
    }
    socket.broadcast.emit("recieve_bid", data);
  })

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
