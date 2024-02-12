import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { uuid } from 'uuidv4';
// https://www.npmjs.com/package/sqlite
// https://github.com/colinhacks/zod
// https://momentjs.com/guides/#/parsing/strict-mode/
sqlite3.verbose(); // enable better error messages
let db = await open({
    filename: "../database.db",
    driver: sqlite3.Database,
});
let app = express();
app.use(express.json({ limit: "1kb" }));
app.post("/api/add-auction", async (req, res) => {
    try {
        const newAuctionId = uuid();
        await db.run('INSERT INTO auction_room (id) VALUES (?)', newAuctionId);
        res.json({ id: newAuctionId });
    }
    catch (error) {
        console.error("Failed to add auction room:", error);
        res.status(500).json({ error: "Failed to add auction room" });
    }
});
let port = 3000;
let host = "localhost";
let protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
