import axios, { AxiosError } from "axios";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

sqlite3.verbose(); // enable better error messages

// workaround b/c top-level await not working with ts-jest
// https://github.com/kulshekhar/ts-jest/issues/4223
function wrapper() {
    let db: Database;
    async function inner() {
        if (!db) {
            db = await open({
                filename: "./database.db",
                driver: sqlite3.Database,
            });
        }
        return db;
    }
    return inner;
}
// await getDB to get a db you can run queries on
let getDB = wrapper();

let port = 3000;
let host = "localhost";
let protocol = "http";
let baseURL = `${protocol}://${host}:${port}/api`;

axios.defaults.baseURL = baseURL;

// https://jestjs.io/docs/getting-started
// https://axios-http.com/docs/api_intro

let widgets = [
    {
        id: 1,
        make: "foo",
        color: "red",
        manufacture_date: "2000-01-01",
        notes: null,
    },
    {
        id: 2,
        make: "foo",
        color: "blue",
        manufacture_date: "2024-01-10",
        notes: "This one is great",
    },
    {
        id: 3,
        make: "quux",
        color: "blue",
        manufacture_date: "2000-01-09",
        notes: null,
    },
    {
        id: 4,
        make: "baaz",
        color: "red",
        manufacture_date: "2001-02-24",
        notes: "I don't like this one",
    },
    {
        id: 5,
        make: "foo",
        color: "blue",
        manufacture_date: "2010-02-03",
        notes: null,
    },
    {
        id: 6,
        make: "bar",
        color: "green",
        manufacture_date: "2000-12-31",
        notes: null,
    },
];

beforeEach(async () => {
    let db = await getDB();
    for (let { id, make, color, manufacture_date, notes } of widgets) {
        await db.run(
            "INSERT INTO widgets(id, make, color, manufacture_date, notes) VALUES(?, ?, ?, ?, ?)",
            [id, make, color, manufacture_date, notes]
        );
    }
});

afterEach(async () => {
    await (await getDB()).run("DELETE FROM widgets");
});

test("GET /widgets returns all widgets", async () => {
    let response = await axios.get("/widgets");
    expect(response.data).toEqual({ widgets: widgets });
});

test("GET /widgets/id returns widget with id", async () => {
    let response = await axios.get("/widgets/1");
    expect(response.data).toEqual(widgets[0]);
});

test("POST /widgets valid body with notes creates widget", async () => {
    let { make, color, manufacture_date } = widgets[0];
    let widget = { make, color, manufacture_date, notes: "Hello" };
    let response = await axios.post("/widgets", widget);
    expect(response.status).toEqual(201);
    let id = Number(response.headers["location"]);
    let dbWidget = await (
        await getDB()
    ).get("SELECT * FROM widgets WHERE id = ?", [id]);
    expect(dbWidget).toEqual({ ...widget, id });
});

test("POST /widgets valid body with no notes creates widget", async () => {
    let { make, color, manufacture_date } = widgets[0];
    let widget = { make, color, manufacture_date };
    let response = await axios.post("/widgets", widget);
    expect(response.status).toEqual(201);
    let id = Number(response.headers["location"]);
    let dbWidget = await (
        await getDB()
    ).get("SELECT * FROM widgets WHERE id = ?", [id]);
    expect(dbWidget).toEqual({ ...widget, id, notes: null });
});

test("POST /widgets invalid color returns error status", async () => {
    let { make, manufacture_date, notes } = widgets[0];
    let invalidWidget = { make, manufacture_date, notes, color: "XYZ" };
    let response;
    try {
        response = await axios.post("/widgets", invalidWidget);
        fail("Should've returned error response");
    } catch (err) {
        let error = err as AxiosError;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(400);
    }
});

test("POST /widgets invalid make returns error status", async () => {
    let { color, manufacture_date, notes } = widgets[0];
    let invalidWidget = { make: "XYZ", manufacture_date, notes, color };
    let response;
    try {
        response = await axios.post("/widgets", invalidWidget);
        fail("Should've returned error response");
    } catch (err) {
        let error = err as AxiosError;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(400);
    }
});

// TODO test with invalid types, MM/DD/YYYY
test("POST /widgets invalid manufacture_date returns error status", async () => {
    let { make, color, notes } = widgets[0];
    let invalidWidget = { make, manufacture_date: "2000-01-32", notes, color };
    let response;
    try {
        response = await axios.post("/widgets", invalidWidget);
        fail("Should've returned error response");
    } catch (err) {
        let error = err as AxiosError;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(400);
    }
});

test("POST /widgets missing data returns error status", async () => {
    let response;
    try {
        response = await axios.post("/widgets", {});
        fail("Should've returned error response");
    } catch (err) {
        let error = err as AxiosError;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(400);
    }
});

test("DELETE /widgets/:id deletes widget", async () => {
    let widgetId = 1;
    let response = await axios.delete(`/widgets/${widgetId}`);
    expect(response.status).toEqual(200);
    let result = await (await getDB()).all("SELECT * FROM widgets");
    expect(widgets.filter(({ id }) => id !== widgetId)).toEqual(result);
});

test("DELETE /widgets/non-existent id returns error", async () => {
    let response;
    try {
        response = await axios.delete("/widgets/999");
        fail("Should've returned error response");
    } catch (err) {
        let error = err as AxiosError;
        if (error.response === undefined) {
            throw Error("Server never sent response");
        }
        expect(error.response.status).toEqual(404);
    }
});

test("PUT /widgets/:id with valid body updates widget", async () => {
    // TODO
});

test("PUT /widgets/:id with invalid color returns errors", async () => {
    // TODO
});

test("PUT /widgets/non-existent id returns error", async () => {
    // TODO
});
