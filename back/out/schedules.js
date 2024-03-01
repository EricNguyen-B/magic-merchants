import schedule from 'node-schedule';
export function scheduleAuctionEvent(auctionID, startDate, endDate, db, io) {
    const sqlQuery = `UPDATE auction_room SET is_active = ? WHERE id = ?`;
    try {
        schedule.scheduleJob(startDate, async () => {
            await db.run(sqlQuery, [true, auctionID])
                .then(() => {
                console.log(`Starting Auction: ${auctionID}`);
                io.sockets.emit("starting_auction");
            });
        });
        schedule.scheduleJob(endDate, async () => {
            await db.run(sqlQuery, [false, auctionID])
                .then(() => {
                console.log(`Ending Auction: ${auctionID}`);
                io.sockets.emit("ending_auction");
            });
        });
    }
    catch (error) {
        console.log("ERROR: Could Not Schedule Event");
    }
}
export class AuctionEventScheduler {
    db;
    io;
    constructor(db, io) {
        this.db = db;
        this.io = io;
    }
    scheduleAuctionEvent(auctionID, startDate, endDate) {
        const sqlQuery = `UPDATE auction_room SET is_active = ? WHERE id = ?`;
        try {
            schedule.scheduleJob(startDate, async () => {
                await this.db.run(sqlQuery, [true, auctionID])
                    .then(() => {
                    console.log(`Starting Auction: ${auctionID}`);
                    this.io.sockets.emit("starting_auction");
                });
            });
            schedule.scheduleJob(endDate, async () => {
                await this.db.run(sqlQuery, [false, auctionID])
                    .then(() => {
                    console.log(`Ending Auction: ${auctionID}`);
                    this.io.sockets.emit("ending_auction");
                });
            });
        }
        catch (error) {
            console.log("ERROR: Could Not Schedule Event");
        }
    }
}
