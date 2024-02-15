import express from "express";
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
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
app.use(cors());
app.use(express.json({ limit: "1kb" }));
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
});
// TO DO: resolve errors with useEffect hook checking active rooms on the main page
app.get("/api/check-active-rooms", async (req, res) => {
    let result;
    try {
        result = await db.all("SELECT * FROM auction_room");
        res.json(result);
    }
    catch (error) {
        console.error("Failed to check for all auction rooms", error);
        res.status(500).json({ error: "Failed to check active auction rooms" });
    }
});
app.post("/api/add-auction", async (req, res) => {
    try {
        console.log("added auction");
        const newAuctionId = uuid();
        await db.run('INSERT INTO auction_room (id) VALUES (?)', newAuctionId);
        res.json({ id: newAuctionId });
    }
    catch (error) {
        console.error("Failed to add auction room:", error);
        res.status(500).json({ error: "Failed to add auction room" });
    }
});
// TO DO: resolve issue not being able to filter select from the DB to display bid history table successfully
app.get("/api/check-bid-history/:auctionId", async (req, res) => {
    let result;
    try {
        const { auctionId } = req.params;
        // console.log(auctionId);
        result = await db.all("SELECT * FROM auction_room");
        res.json(result);
    }
    catch (error) {
        console.error("Failed to check bid history with auction ID", error);
        res.status(500).json({ error: "Failed to check bid history" });
    }
});
// app.listen(port, host, () => {
//     console.log(`${protocol}://${host}:${port}`);
// });
server.listen(port, () => {
    console.log(`${protocol}://${host}:${port}`);
});
