import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
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
    // For simplicity, generate a simple unique ID, in a real app you would insert into the database
    const newAuctionId = Date.now().toString(); // Example ID generation
    // You would save to the database here
    res.json({ id: newAuctionId });
});
let port = 3000;
let host = "localhost";
let protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
