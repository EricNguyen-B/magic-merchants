import schedule from 'node-schedule';
import { Database } from 'sqlite';
import { Server, Socket } from "socket.io";

export class AuctionEventScheduler{
    private db: Database;
    private io: Server;
    public constructor(db : Database, io : Server){
        this.db = db;
        this.io = io;
    }
    public scheduleEvent(auctionID: String, startDate: Date, endDate: Date){
        const sqlQuery = `UPDATE auction_room SET is_active = ? WHERE id = ?`;
        try{
            schedule.scheduleJob(startDate, async () => {
                await this.db.run(sqlQuery, [true, auctionID])
                .then(()=> {
                        console.log(`Starting Auction: ${auctionID}`);
                        this.io.listeners
                        this.io.sockets.emit("starting_auction");
                    }
                )
            });
            schedule.scheduleJob(endDate, async () => {
                await this.db.run(sqlQuery, [false, auctionID])
                .then(()=> {
                        console.log(`Ending Auction: ${auctionID}`);
                        this.io.sockets.emit("ending_auction");
                    }
                )
            })
        }catch(error){
            console.log("ERROR: Could Not Schedule Event")
        }
    }


}