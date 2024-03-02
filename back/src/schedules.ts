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
            });
        }catch(error){
            console.log("ERROR: Could Not Schedule Event");
        }
    }
    public async scheduleEvents(){
        /**INCOMPLETE WORK IN PROGRESS**/
        const sqlQuerySetActive = `UPDATE auction_room SET is_active = 1 
                            WHERE ? BETWEEN date_start AND date_end`;
        const sqlQuerySetInactive = `UPDATE auction_room SET is_active = 0 
                            WHERE ? NOT BETWEEN date_start AND date_end`;
        const sqlQueryFutureEvents = `SELECT * FROM auction_room 
                                        WHERE ? NOT BETWEEN date_start AND date_end AND ? < date_start`;
        try{
            const currDate = new Date();
            await this.db.run(sqlQuerySetActive, [currDate]);
            await this.db.run(sqlQuerySetInactive, [currDate]);
            const futureEvents = await this.db.all(sqlQueryFutureEvents, [currDate, currDate]);
            /**Schedule Future Events**/
            futureEvents.forEach(auction => {
                console.log(auction.id, auction.date_start, auction.date_end);
                this.scheduleEvent(auction.id, auction.date_start, auction.date_end);
            });
            
        }catch(error){
            console.log(error);
        }
    }


}