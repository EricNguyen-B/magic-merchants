import express, { Response, Request, RequestHandler, CookieOptions, query } from "express";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import * as argon2 from "argon2";
import { Database } from 'sqlite';
import * as schemas from "./schemas.js";
import * as types from "./types.js";

const cookieOptions: CookieOptions = {
    httpOnly: true, // don't allow JS to touch cookies
    secure: true, // only send cookies over HTTPS
    sameSite: "strict", // https://web.dev/articles/samesite-cookies-explained
    maxAge: 36000000 //Expires after an hour
};
function makeToken() {
    return crypto.randomBytes(32).toString("hex");
}

export class Authenicator{
    private db: Database;
    private tokenStorage: { [key: string]: string };
    public constructor(db : Database){
        this.db = db;
        this.tokenStorage = {};
    }
    public authorize: RequestHandler = (req, res, next) => {
        let { token } = req.cookies;
        console.log(this.tokenStorage);
        if (token === undefined || !this.tokenStorage.hasOwnProperty(token)) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        next();
    };
    public privateAPI(req: Request, res: Response<types.MessageResponse>) {
        return res.json({ message: "Authentication Successful. Valid Cookie" });
    }
    public async login(req: Request, res: Response<types.MessageResponse>) {
        const sqlSearchUserQuery = `SELECT * FROM users WHERE email = ?`;
        let parseResult = schemas.loginSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res
                .status(400)
                .json({ message: "Username or password invalid" });
        }
        let { email, password } = parseResult.data;
        try{
            // get user's password from DB
            let user = await this.db.get(sqlSearchUserQuery, [email]);
            // if username didn't exist, handle error
            if (user === undefined){
                return res.status(404).json({ message: "User Not Found" });
            }
            // else, hash plaintext password from body, compare w/ DB password
            let verifyPassword = await argon2.verify(user.password, password);
            // if no match, 400 response
            if (!verifyPassword){
                return res.status(400).json({ message: "Incorrect Password"});
            }
            // if match, create token, store in tokenStorage, set cookie
            let token = makeToken();
            this.tokenStorage[token] = email;
            return res.status(200)
                .cookie("token", token, cookieOptions)
                .send();
        }catch(error){
            console.error("Error in login:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    public async register(req: Request, res: Response<types.MessageResponse>){
        const sqlCreateUserQuery = `INSERT INTO users(email, username, password) VALUES (?, ?, ?)`;
        const sqlSearchUserQuery = `SELECT * FROM users WHERE email = ?`;
        //Validate the request query to see if the types match the registerSchema
        let parseResult = schemas.registerSchema.safeParse(req.body);
        console.log(req.body);
        if (!parseResult.success) {
            return res
                .status(400)
                .json({ message: "Username or password invalid" });
        }
        let {email, username, password} = parseResult.data;
        //Check if user already exists with the email provided
        let user = await this.db.get(sqlSearchUserQuery, [email]);
        //If user exists, return error
        if (user !== undefined){
            return res.status(409).json({message: "User Already Exists"});
        }
        //Hash the password and store it in database
        const hashedPassword = (await argon2.hash(password)).toString();
        await this.db.run(sqlCreateUserQuery, [email, username, hashedPassword]);
        //Create token and set cookie that expires after 1 hour
        let token = makeToken();
        this.tokenStorage[token] = email;
        return res.status(201)
                .cookie("token", token, cookieOptions)
                .json({message: "SUCCESS: User Account Created"});
    }
    public async logout(req: Request, res: Response<types.EmptyResponse>) {
        // if logged in and token valid, remove token from tokenStorage, clear cookie
        let token = req.cookies.token;
        if (this.tokenStorage[token]){
            delete this.tokenStorage[token];
            return res.clearCookie("token", cookieOptions).send();
        }
        return res.status(200).send();
    }

}