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