import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import { useEffect, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import axios from '../../../node_modules/axios/index';

const drawerWidth = 240;

type Room = {
    id: string;
}

const Sidebar = () => {
    const [rooms, setRooms] = useState<Room[]>([]);

    const checkActiveRooms = async () => {
        const response = await axios.get(`/api/check-active-rooms`);
        setRooms(response.data);
    }

    useEffect(() => {
        checkActiveRooms();
    }, rooms)

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
                open={open}
                style={{paddingTop: "20px"}}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItemText style={{display:'flex', justifyContent:'center'}} secondary="RECOMMENDED ROOMS"/>
                        {rooms.length > 0 ? (
                            rooms.map((room: Room, index) => (
                                <ListItem key={room} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <MeetingRoomIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={room.id} />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        ): (
                            <p>No Active Rooms</p>
                        )}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}

export default Sidebar;