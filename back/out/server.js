import express from "express";
// import { z } from "zod";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { v4 as uuid } from 'uuid';
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import * as dotenv from 'dotenv';
import * as schemas from "./schemas.js";
import { Authenicator } from "./authenticators.js";
import cookieParser from "cookie-parser";
import { AuctionEventScheduler } from "./schedules.js";
import Stripe from 'stripe';
dotenv.config({ path: '../.env' });
sqlite3.verbose();
const db = await open({
    filename: "../database.db",
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");
const app = express();
const server = http.createServer(app);
const allowedOrigins = ["http://localhost:5173", process.env.CORS_ORIGIN];
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ["GET", "POST"]
    }
});
app.use(cookieParser());
app.use(cors());
app.use(express.json({ limit: "1kb" }));
const authenicator = new Authenicator(db);
const auctionEventScheduler = new AuctionEventScheduler(db, io);
auctionEventScheduler.onStartScheduleEvents();
/**Websocket Event Handlers**/
async function handleSendBidEvent(data, socket) {
    try {
        const { price, auction_id } = data;
        // Retrieve the current highest bid for the auction
        const currentHighestBidResult = await db.get('SELECT MAX(price) AS highest_price FROM user_bid WHERE auction_id = ?', [auction_id]);
        const currentHighestBid = currentHighestBidResult ? currentHighestBidResult.highest_price : 0;
        // Check if the new bid is higher than the current highest bid
        if (price > currentHighestBid) {
            const newBidId = uuid();
            await db.run('INSERT INTO user_bid(id, auction_id, price) VALUES (?, ?, ?)', [newBidId, auction_id, price]);
            io.to(auction_id).emit("received_bid", { bid_price: price });
            io.emit(`${auction_id}/received_bid`, { bid_price: price });
        }
        else {
            // Bid is not higher than the current highest bid, notify the bidding user
            socket.emit("bid_error", { message: "Your bid must be higher than the current highest bid." });
        }
    }
    catch (error) {
        console.log("Failed to send bid", error);
        // Optionally, notify the user of the failure more directly, if your setup allows
        socket.emit("bid_error", { message: "Failed to process your bid. Please try again." });
    }
}
async function handleJoinRoomEvent(data, socket) {
    try {
        const { auction_id } = data;
        socket.join(auction_id);
        const room = io.sockets.adapter.rooms.get(auction_id);
        io.to(auction_id).emit("joined_room", { viewer_count: room?.size });
        io.emit(`${auction_id}/view_count`, { viewer_count: room?.size });
    }
    catch (error) {
        console.log("Failed to join room");
    }
}
async function handleExitRoomEvent(data, socket) {
    try {
        const { auction_id } = data;
        socket.leave(auction_id);
        const room = io.sockets.adapter.rooms.get(auction_id);
        io.to(auction_id).emit("exited_room", { viewer_count: room?.size });
        io.emit(`${auction_id}/view_count`, { viewer_count: room?.size });
    }
    catch (error) {
        console.log(error);
        console.log("Failed to exit room");
    }
}
async function handleViewerCountEvent(data, socket) {
    try {
        const { auction_id } = data;
        const room = io.sockets.adapter.rooms.get(auction_id);
        io.emit(`${auction_id}/view_count`, { viewer_count: room?.size });
    }
    catch (error) {
        console.log(error);
        console.log("Failed to count viewers");
    }
}
async function handleSendMessageEvent(data, socket) {
    try {
        console.log("message sent");
        const { text_message, auction_id } = data;
        console.log(text_message);
        const newMessageId = uuid();
        console.log(auction_id);
        await db.run('INSERT INTO chat_messages (message_id, text_message, auction_id) VALUES (?, ?, ?)', [newMessageId, text_message, auction_id]);
        socket.to(auction_id).emit("received_message", { message_id: newMessageId, text_message, auction_id });
    }
    catch (error) {
        console.log("Failed to send message", error);
    }
}
async function getHighestBidForAuction(auctionId) {
    try {
        const query = `SELECT MAX(price) AS highest_bid FROM user_bid WHERE auction_id = $1 GROUP BY auction_id`;
        // Use the pool to execute the query
        const res = await db.get(query, [auctionId]);
        // Check if we got a result back
        if (res.rows.length > 0) {
            return res.rows[0].highest_bid; // Return the highest bid
        }
        else {
            return null; // No bids found for this auction
        }
    }
    catch (err) {
        console.error('Error querying the highest bid for auction:', err);
        throw err; // Rethrow the error to handle it in the calling function
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
    socket.on("send_message", (data) => {
        handleSendMessageEvent(data, socket);
    });
    socket.on("getting_viewer_count", (data) => {
        handleViewerCountEvent(data, socket);
    });
});
app.post("/api/login", (req, res) => authenicator.login(req, res));
app.post("/api/register", (req, res) => authenicator.register(req, res));
app.post("/api/logout", (req, res) => authenicator.logout(req, res));
app.get("/api/authCookie", authenicator.authorize, (req, res, next) => authenicator.privateAPI(req, res));
// TO DO: resolve errors with useEffect hook checking active rooms on the main page
app.get("/api/chat-history/:auctionId", async (req, res) => {
    try {
        const { auctionId } = req.params;
        const messages = await db.all("SELECT * FROM chat_messages WHERE auction_id = ?", auctionId);
        res.json(messages);
    }
    catch (error) {
        console.error("Failed to fetch chat history", error);
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
});
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
    const sqlCreateAuctionQuery = `INSERT INTO auction_room 
      (id, card_name, card_condition, date_start, date_end, min_bid_price, min_bid_increments) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    try {
        /**Validate Request Schema**/
        const { dateStart, dateEnd, cardName, cardCondition, minBidPrice, minBidIncrement } = schemas.auctionSchema.parse(req.body);
        /**generate Auction ID**/
        const auctionID = uuid();
        /**Run Auction Query and Then Schedule Event**/
        await db.run(sqlCreateAuctionQuery, [auctionID, cardName, cardCondition, dateStart, dateEnd, minBidPrice, minBidIncrement])
            .then(() => {
            auctionEventScheduler.scheduleEvent(auctionID, dateStart, dateEnd);
        });
        /**Return a Success Message**/
        res.status(200).json({ message: "Success", auction: req.body });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to add auction room" });
    }
});
app.get("/api/check-bid-history/:auctionId", async (req, res) => {
    const sqlGetBidHistory = 'SELECT * FROM user_bid WHERE auction_id = ?';
    try {
        const { auctionId } = req.params;
        const result = await db.all(sqlGetBidHistory, [auctionId]);
        res.json(result);
    }
    catch (error) {
        console.error("Failed to check bid history with auction ID", error);
        res.status(500).json({ error: "Failed to check bid history" });
    }
});
app.get("/api/check-top-bids", async (req, res) => {
    const sqlGetTopBids = 'SELECT id, auction_id, MAX(price) AS price FROM user_bid GROUP BY auction_id';
    try {
        const result = await db.all(sqlGetTopBids);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to check bid history" });
    }
});
const stripe = new Stripe(process.env.STRIPE_API_KEY || '');
app.post('/create-payment-intent', async (req, res) => {
    const { auctionId, email } = req.body; // Expect auctionId to determine the price
    try {
        // Assuming you have a function to query your database
        // This function should return the highest bid for the given auctionId
        const highestBid = await getHighestBidForAuction(auctionId);
        if (!highestBid) {
            return res.status(400).send({ error: "No bids found for the auction." });
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: highestBid,
            currency: 'usd',
            receipt_email: email,
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (error) {
        console.error('Failed operation:', error);
        res.status(400).send({ error: "Operation failed" });
    }
});
server.listen(3000, () => {
    console.log(`http://localhost:3000`);
});
