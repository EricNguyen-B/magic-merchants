import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import axios from 'axios';
import { Room } from '../../types';
import * as ENV from '../utils/Environment';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const drawerWidth = 240;

const Sidebar = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const navigate = useNavigate(); // Hook for navigation

    const checkActiveRooms = async () => {
        const response = await axios.get(`${ENV.getServerURL()}/api/check-active-rooms`);
        setRooms(response.data);
    }

    useEffect(() => {
        checkActiveRooms();
    }, [])

    // Function to handle room navigation
    const handleNavigateToRoom = (room: Room) => {
        navigate(`/auction-room`, { state: room });
    }

    return ( 
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
                open={true}
                style={{ paddingTop: "20px" }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItemText style={{ display: 'flex', justifyContent: 'center' }} secondary="RECOMMENDED ROOMS"/>
                        {rooms.length > 0 ? (
                            rooms.map((room: Room, index) => (
                                <ListItem key={room.id} disablePadding>
                                    <ListItemButton onClick={() => handleNavigateToRoom(room)}>
                                        <ListItemIcon>
                                            <MeetingRoomIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={room.card_name} /> {/* Display the card name instead of id */}
                                    </ListItemButton>
                                </ListItem>
                            ))
                        ) : (
                            <p>No Active Rooms</p>
                        )}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}

export default Sidebar;
