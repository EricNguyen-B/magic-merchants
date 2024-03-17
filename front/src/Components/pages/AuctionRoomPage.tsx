import { useContext, useEffect, useState } from 'react';
import {SocketContext} from '../../Context/SocketContext'
import { useLocation } from 'react-router-dom';
import BidHistoryTable from "../content/AuctionRoomBidTable";
import ChatBox from "../content/ChatBox";
import TimerCountDown from '../common/Timer';
import { Room } from '../../types';
import Navbar from "../common/Navbar";
import {TextField, FormControl, Button, Grid} from '@mui/material';
import '../../styles/HomePage.css';
import dayjs from 'dayjs';


const AuctionRoom = () => {
    const socket = useContext(SocketContext).socket;
    const location = useLocation();
    const room: Room = location.state;
    const [bidPrice, setBidPrice] = useState<string>("");
    const [viewerCount, setViewerCount] = useState<number>(0);

    const handleSubmitBid = () => {
        socket?.emit("sending_bid", {price: parseInt(bidPrice), auction_id: room.id});
      }
    /**Join Room of Auction ID**/
    useEffect(() => {
        console.log(room);
        socket?.emit("joining_room", {auction_id: room.id});
        socket?.on("joined_room", (data) => {setViewerCount(data['viewer_count']);});
        socket?.on("exited_room", (data) => {setViewerCount(data['viewer_count']);});
        /**Clean up socket listeners**/
        return () => {
            socket?.emit("exiting_room", {auction_id: room.id});
            socket?.off("joined_room");
            socket?.off("exited_room");
        };
    }, [socket])

    return (
        <Grid className="homepage-container">
            <Grid item>
                <Navbar />
                <h1>Auction Room {room.card_name}</h1>
                <h1>Current Viewer Count: {viewerCount}</h1>
                {(() => {
                        //TODO: Refactor Switch Statements into A JSX Function That Takes in 3 Components and Room as Props
                        switch (room.room_status){
                            case "active":
                                return (<div>
                                            <h1>Countdown Till Auction End</h1>
                                            <TimerCountDown date={dayjs(room.date_end)}></TimerCountDown>
                                        </div>)
                            case "inactive":
                                return (<div>
                                            <h1>Countdown Till Auction Starts</h1>
                                            <TimerCountDown date={dayjs(room.date_start)}></TimerCountDown>
                                        </div>)
                            case "complete":
                                return (<p>AUCTION COMPLETE</p>)
                        }
                    })()}
            </Grid>
            <FormControl className="bid-input">
                <TextField
                    label="Enter Bid Price"
                    variant="outlined"
                    value={bidPrice}
                    type="number"
                    onChange={(newValue) => setBidPrice(newValue.target.value)}
                />
            </FormControl>
            <Button 
                onClick={handleSubmitBid} 
                variant="contained">Submit
            </Button>
            <BidHistoryTable {...room} />
            <ChatBox {...room} />
        </Grid>
    );
}

export default AuctionRoom;
