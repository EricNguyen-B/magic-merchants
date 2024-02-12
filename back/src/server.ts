import express, { application, Response } from "express";
import { z } from "zod";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import moment from "moment";

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
    // TODO: create a proper unique ID. For now, we generate a simple unique ID by Date
    const newAuctionId = Date.now().toString(); 
    // TODO: Save to the database after
    res.json({ id: newAuctionId });
});

let port = 3000;
let host = "localhost";
let protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
