import { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import RoomCard from './RoomCard';

type Room = {
    id: string;
}

export default function RoomsGrid() {
    const [rooms, setRooms] = useState<Room[]>([]);

    const checkActiveRooms = async () => {
        const response = await axios.get(`/api/check-active-rooms`);
        setRooms(response.data);
    }

    useEffect(() => {
        checkActiveRooms();
    }, rooms)

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                {rooms.length > 0 ? (
                    rooms.map((room: Room) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}> {/* Set the grid item sizes */}
                            <RoomCard id={room.id} />
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
