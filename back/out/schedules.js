import schedule from 'node-schedule';
export class AuctionEventScheduler {
    db;
    io;
    constructor(db, io) {
        this.db = db;
        this.io = io;
    }
    scheduleEvent(auctionID, startDate, endDate) {
        const sqlQuery = `UPDATE auction_room SET room_status = ? WHERE id = ?`;
        try {
            schedule.scheduleJob(startDate, async () => {
                await this.db.run(sqlQuery, ["active", auctionID])
                    .then(() => {
                    console.log(`Starting Auction: ${auctionID}`);
                    this.io.sockets.emit("starting_auction");
                });
            });
            schedule.scheduleJob(endDate, async () => {
                await this.db.run(sqlQuery, ["completed", auctionID])
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
    async onStartScheduleEvents() {
        const sqlQuerySetActive = `UPDATE auction_room SET room_status = 'active' WHERE ? BETWEEN date_start AND date_end`;
        const sqlQuerySetInactive = `UPDATE auction_room SET room_status = 'inactive' WHERE ? < date_start`;
        const sqlQuerySetComplete = `UPDATE auction_room SET room_status = 'complete' WHERE ? > date_end`;
        const sqlQueryFutureEvents = `SELECT * FROM auction_room WHERE ? < date_start`;
        const sqlQueryCurrentEvents = `SELECT * FROM auction_room WHERE ? > date_start AND ? < date_end`;
        try {
            const currDate = new Date().toISOString();
            await this.db.run(sqlQuerySetActive, [currDate]);
            await this.db.run(sqlQuerySetInactive, [currDate]);
            await this.db.run(sqlQuerySetComplete, [currDate]);
            const currentEvents = await this.db.all(sqlQueryCurrentEvents, [currDate, currDate]);
            const futureEvents = await this.db.all(sqlQueryFutureEvents, [currDate]);
            /**Schedule Future Events**/
            console.log("-----------------Scheduling Future Events-----------------");
            futureEvents.forEach(auction => {
                console.log(auction.id, auction.date_start, auction.date_end);
                this.scheduleEvent(auction.id, auction.date_start, auction.date_end);
            });
            /**Schedule Ongoing Events**/
            console.log("-----------------Scheduling Current Events-----------------");
            currentEvents.forEach(auction => {
                console.log(auction.id, auction.date_start, auction.date_end);
                this.scheduleEvent(auction.id, auction.date_start, auction.date_end);
            });
        }
        catch (error) {
            console.log(error);
        }
    }
}
