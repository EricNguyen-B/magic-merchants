import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import RoomCard from './RoomCard';
import { Room, Bid } from '../../types';
import {SocketContext} from '../../Context/SocketContext'

export default function RoomsGrid() {
    const socket = useContext(SocketContext).socket;
    const [rooms, setRooms] = useState<Room[]>([]);
    const [topBids, setTopBids] = useState<Bid[]>([]);

    const checkTopBids = async () => {
        const response = await axios.get("https://magic-merchants-16edcf281bcc.herokuapp.com/api/check-top-bids");
        setTopBids(response.data);
    }
    const checkActiveRooms = async () => {
        const response = await axios.get(`https://magic-merchants-16edcf281bcc.herokuapp.com/api/check-active-rooms`);
        setRooms(response.data);
    }
    /**Listen for Auction Room Changes**/
    useEffect(() => {
        socket?.on("starting_auction", () => {
            console.log("A room is starting");
            checkActiveRooms()
        });
        socket?.on("ending_auction", () => {
            console.log("A room is ending");
            checkActiveRooms()
        });
        checkActiveRooms();
        /**Clean up socket listeners**/
        return () => {
            socket?.off("starting_auction");
            socket?.off("ending_auction");
        };
    }, [socket]);
    /**Check Top Bids For All Rooms**/
    useEffect(() => {
        checkTopBids();
    }, []); 

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                {rooms.length > 0 ? (
                    rooms.map((room: Room) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}> {/* Set the grid item sizes */}
                            <RoomCard 
                                room={room} 
                                bid={topBids.find(bid => bid.auction_id === room.id) || 
                                    { id: '', auction_id: '', price: 0 }}
                            />
                        </Grid>
                    ))
                ) : (
                    // This should also be in a Grid item to maintain structure
                    <Grid item xs={12}>
                        <h2>No Active Rooms</h2>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
