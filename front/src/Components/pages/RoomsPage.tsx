import { useState, useEffect } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import RoomsList from "../content/RoomsList";

type ActiveRoom = {
    id: string;
};

function RoomsPage() {
    const [activeRooms, setActiveRooms] = useState<ActiveRoom[]>([]);

    const handleAddRoom = async () => {
        try {
            await axios.post("/api/add-auction");            
        } catch (error) {
            console.error(error);
        }
    };

    const checkActiveRooms = async () => {
        const rooms = await axios.get("/api/check-active-rooms");
        setActiveRooms(rooms.data);
    }

    useEffect(() => {
        checkActiveRooms();
    }, [activeRooms])

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <RoomsList rooms={activeRooms}/>
            </Grid>
            <Grid item xs={8}>
                <Button 
                    onClick={handleAddRoom} 
                    variant="contained"
                >
                    Add Auction Room
                </Button>
            </Grid>
        </Grid>
    );
}

export default RoomsPage;
