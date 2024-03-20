import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { v4 as uuid } from 'uuid';
import * as url from "url";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import * as dotenv from 'dotenv';
import * as schemas from "./schemas.js";
import { Authenicator } from "./authenticators.js";
import cookieParser from "cookie-parser";
import { AuctionEventScheduler } from "./schedules.js";
import axios from "axios";
dotenv.config({ path: '../.env' });
sqlite3.verbose();
let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
let dbfile = `${__dirname}database.db`;
let db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const corsOptions = {
    origin: ["https://65f61e1914875808d3079c84--magic-merchants.netlify.app", "http://localhost:5173"],
    credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "1kb" }));
const authenicator = new Authenicator(db);
const auctionEventScheduler = new AuctionEventScheduler(db, io);
auctionEventScheduler.onStartScheduleEvents();
/**Websocket Event Handlers**/
async function handleSendBidEvent(data, socket) {
    try {
        const { price, auction_id, buyer_email } = data;
        const newBidId = uuid();
        await db.run('INSERT INTO user_bid(id, buyer_email, auction_id, price) VALUES (?, ?, ?, ?)', [newBidId, buyer_email, auction_id, price]);
        io.to(auction_id).emit("recieved_bid", { bid_price: price });
        io.emit(`${auction_id}/recieved_bid`, { bid_price: price });
    }
    catch (error) {
        console.log("Failed to send bid");
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
        const { text_message, auction_id, viewer_email } = data;
        const newMessageId = uuid();
        await db.run('INSERT INTO chat_messages (message_id, viewer_email, text_message, auction_id) VALUES (?, ?, ?, ?)', [newMessageId, viewer_email, text_message, auction_id]);
        socket.to(auction_id).emit("received_message", { message_id: newMessageId, text_message, auction_id });
    }
    catch (error) {
        console.log("Failed to send message", error);
    }
}
/**Websocket Middleware For Authentication**/
io.use((socket, next) => {
    authenicator.authorizeSocketConnection(socket, (error) => {
        if (error) {
            console.error('Unauthorized socket connection:', error.message);
            socket.disconnect(true);
        }
        else {
            next();
        }
    });
});
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
      (id, seller_email, card_name, card_condition, date_start, date_end, min_bid_price, min_bid_increments, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
        console.log(req.body);
        /**Validate Request Schema**/
        const { sellerEmail, dateStart, dateEnd, cardName, cardCondition, minBidPrice, minBidIncrement, imageUrl } = schemas.auctionSchema.parse(req.body);
        /**generate Auction ID**/
        const auctionID = uuid();
        /**Run Auction Query and Then Schedule Event**/
        await db.run(sqlCreateAuctionQuery, [auctionID, sellerEmail, cardName, cardCondition, dateStart, dateEnd, minBidPrice, minBidIncrement, imageUrl])
            .then(() => {
            auctionEventScheduler.scheduleEvent(auctionID, dateStart, dateEnd);
        });
        /**Return a Success Message**/
        res.status(200).json({ message: "Success", auction: req.body });
    }
    catch (error) {
        console.log(error);
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
    const sqlGetTopBids = 'SELECT id, buyer_email, auction_id, MAX(price) AS price FROM user_bid GROUP BY auction_id';
    try {
        const result = await db.all(sqlGetTopBids);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to check bid history" });
    }
});
app.get("/api/get-sets", async (req, res) => {
    try {
        const response = await axios.get("https://api.magicthegathering.io/v1/sets");
        if (response.data && response.data.sets) {
            const sets = response.data.sets.map((set) => ({
                code: set.code,
                name: set.name
            }));
            res.json(sets);
        }
        else {
            res.status(404).json({ error: "No sets found" });
        }
    }
    catch (error) {
        console.error("Failed to get card sets", error);
        res.status(500).json({ error: "Failed to get card sets" });
    }
});
app.get("/api/get-card-image/:cardName", async (req, res) => {
    try {
        const { cardName } = req.params;
        const result = await axios.get(`https://api.magicthegathering.io/v1/cards?name=${cardName}`);
        const imageUrl = result.data.cards[0]?.imageUrl;
        res.json({ imageUrl });
    }
    catch (error) {
        console.error(`Failed to get image for card ${req.params.cardName}`, error);
        res.status(500).json({ error: "Failed to get card image" });
    }
});
app.get("/api/get-cards/:setCode", async (req, res) => {
    const { setCode } = req.params;
    try {
        const response = await axios.get(`https://api.magicthegathering.io/v1/cards?set=${setCode}`);
        if (response.data && response.data.cards) {
            const cards = response.data.cards.map((card) => ({
                id: card.id,
                name: card.name,
                imageUrl: card.imageUrl // Ensure you're handling cases where some cards may not have an image
            }));
            res.json(cards);
        }
        else {
            res.status(404).json({ error: "No cards found for this set" });
        }
    }
    catch (error) {
        console.error(`Failed to get cards for set ${setCode}`, error);
        res.status(500).json({ error: `Failed to get cards for set ${setCode}` });
    }
});
const port = process.env.PORT;
const host = process.env.HOST;
const protocal = process.env.PROTOCAL;
server.listen(port, () => {
    console.log(`${protocal}://${host}:${port}`);
});
