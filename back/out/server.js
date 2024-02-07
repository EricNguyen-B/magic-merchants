import express from "express";
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
let colors = ["red", "blue", "green"];
let makes = ["foo", "bar", "baaz", "quux"];
let widgetBodySchema = z.object({
    make: z.enum(makes),
    color: z.enum(colors),
    manufacture_date: z.string().refine((s) => {
        return moment(s, "YYYY-MM-DD", true).toString() !== "Invalid date";
    }),
    notes: z.optional(z.string()),
});
// could use this to refer to the Widget's type
// if we wanted to try typing the request handlers
// to ensure they returned the right things
// type Widget = z.infer<typeof widgetBodySchema>;
// if parsing fails, will return a list of string error messages
function parseError(zodError) {
    let { formErrors, fieldErrors } = zodError.flatten();
    return [
        ...formErrors,
        ...Object.entries(fieldErrors).map(([property, message]) => `"${property}": ${message}`),
    ];
}
app.get("/api/widgets/:id", async (req, res) => {
    let { id } = req.params;
    let result;
    try {
        result = await db.get("SELECT * FROM widgets WHERE id = ?", [id]);
    }
    catch (err) {
        let error = err;
        return res.status(500).json({ errors: [error.toString()] });
    }
    if (result === undefined) {
        return res.status(404).json();
    }
    return res.json(result);
});
app.get("/api/widgets", async (req, res) => {
    let result;
    try {
        result = await db.all("SELECT * FROM widgets");
    }
    catch (err) {
        let error = err;
        return res.status(500).json({ errors: [error.toString()] });
    }
    return res.json({ widgets: result });
});
app.post("/api/widgets", async (req, res) => {
    let parseResult = widgetBodySchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ errors: parseError(parseResult.error) });
    }
    let { make, color, manufacture_date, notes } = parseResult.data;
    let dbResult;
    try {
        dbResult = await db.get("INSERT INTO widgets(make, color, manufacture_date, notes) VALUES(?, ?, date(?), ?) RETURNING *", [make, color, manufacture_date, notes]);
    }
    catch (err) {
        let error = err;
        return res.status(500).json({ errors: [error.toString()] });
    }
    let { id } = dbResult;
    res.status(201).set("Location", id).json();
});
app.delete("/api/widgets/:id", async (req, res) => {
    let { id } = req.params;
    let result;
    try {
        result = await db.get("DELETE FROM widgets WHERE id = ? RETURNING id", [
            id,
        ]);
    }
    catch (err) {
        let error = err;
        return res.status(500).json({ errors: [error.toString()] });
    }
    if (result === undefined) {
        return res.status(404).json();
    }
    return res.json();
});
app.put("/api/widgets/:id", async (req, res) => {
    // TODO
});
let port = 3000;
let host = "localhost";
let protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
