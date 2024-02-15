import express, { application, Response } from "express";
import { z } from "zod";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import moment from "moment";
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

// TO DO: resolve issue not being able to filter select from the DB to display bid history table successfully
app.get("/api/check-bid-history/:auctionId", async (req, res) => {
  let result;
  try {
    const { auctionId } = req.params;
    // console.log(auctionId);
    result = await db.all("SELECT * FROM auction_room");
    res.json(result);
  } catch (error) {
    console.error("Failed to check bid history with auction ID", error);
    res.status(500).json({ error: "Failed to check bid history" });
  }
});

let port = 3000;
let host = "localhost";
let protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
