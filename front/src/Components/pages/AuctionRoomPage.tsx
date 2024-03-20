import { useContext, useEffect, useState } from 'react';
import {SocketContext} from '../../Context/SocketContext'
import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import BidHistoryTable from "../content/AuctionRoomBidTable";
import ChatBox from "../content/ChatBox";
import TimerCountDown from '../common/Timer';
import { Room } from '../../types';
import Navbar from "../common/Navbar";
import { TextField, FormControl, Button, Grid } from '@mui/material';
import '../../styles/HomePage.css';
import dayjs from 'dayjs';
import { useCookies } from 'react-cookie';

const AuctionRoom = () => {
    let [cookies, setCookies] = useCookies(['user_email']);
  const navigate = useNavigate();
  const socket = useContext(SocketContext).socket;
  const location = useLocation();
  const room: Room = location.state;
  const [bidPrice, setBidPrice] = useState<string>("");
  const [viewerCount, setViewerCount] = useState<number>(0);

  const handleSubmitBid = () => {
    console.log(cookies.user_email);
    socket?.emit("sending_bid", { price: parseInt(bidPrice), auction_id: room.id, buyer_email: cookies.user_email});
  };

  useEffect(() => {
    console.log(room);
    socket?.emit("joining_room", { auction_id: room.id });
    socket?.on("joined_room", (data) => { setViewerCount(data['viewer_count']); });
    socket?.on("exited_room", (data) => { setViewerCount(data['viewer_count']); });

    return () => {
      socket?.emit("exiting_room", { auction_id: room.id });
      socket?.off("joined_room");
      socket?.off("exited_room");
    };
  }, [socket]);

  // Navigate to Payment Page when auction ends
//   useEffect(() => {
//     if (room.room_status === 'complete') {
//       navigate('/payment'); // Adjust the path as necessary
//     }
//   }, [room.room_status]);

    return (


        <Grid container spacing={2} className="homepage-container" style={{ marginTop: '80px' }}>
            
            <Grid container justifyContent="center" spacing={2}>
                <Navbar />
                <Grid item xs={12} md={8} lg={6}>
                    <Card raised style={{ backgroundColor: '#424242', padding: '1rem' }}>
                        <CardContent>
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <img
                                    src={room.image_url}
                                    alt={`Image of ${room.card_name}`}
                                    className="auction-room-image"
                                    style={{ marginRight: '20px', width: '200px', height: 'auto' }} // Adjust width as needed
                                />
                                <div>
                                    <Typography variant="h4" component="h1" gutterBottom>
                                        Auction Room {room.card_name}
                                    </Typography>
                                    <Typography variant="h6" component="h2">
                                        Current Viewer Count: {viewerCount}
                                    </Typography>
                                    {(() => {
                                        switch (room.room_status) {
                                        case "active":
                                            return (
                                            <div>
                                                <h2>Countdown Till Auction End</h2>
                                                <TimerCountDown date={dayjs(room.date_end)} />
                                            </div>
                                            );
                                        case "inactive":
                                            return (
                                            <div>
                                                <h2>Countdown Till Auction Starts</h2>
                                                <TimerCountDown date={dayjs(room.date_start)} />
                                            </div>
                                            );
                                        case "complete":
                                            return <p>AUCTION COMPLETE</p>;
                                        }
                                    })()}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                                        <FormControl className="bid-input" style={{ flexGrow: 1, marginRight: '1rem' }}>
                                            <TextField
                                            label="Enter Bid Price"
                                            variant="outlined"
                                            value={bidPrice}
                                            type="number"
                                            onChange={(e) => setBidPrice(e.target.value)}
                                            InputProps={{ style: { fontSize: '1.5rem' } }} // Make the text larger
                                            InputLabelProps={{ style: { fontSize: '1.5rem' } }} // Adjust the label size if needed
                                            />
                                        </FormControl>
                                        <Button 
                                            onClick={handleSubmitBid} 
                                            variant="contained"
                                            size="large" 
                                            style={{
                                            fontSize: '1.5rem', 
                                            padding: '0.5rem 2rem', 
                                            minWidth: '150px' 
                                            }}
                                        >
                                            BID
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Grid item style={{ marginTop: '20px', marginLeft: '20px' }}>
                        <BidHistoryTable {...room} />
                    </Grid>
                </Grid>
                <Grid item xs={12} md={4} lg={6}>
                    <div style={{ height: '300px' }}> {/* Set a fixed height and allow scrolling */}
                        <ChatBox {...room} />
                    </div>
                </Grid>

            </Grid>
        </Grid>
    );
}

export default AuctionRoom;
