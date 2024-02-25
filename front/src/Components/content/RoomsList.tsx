import React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';

type ActiveRoom = {
    id: string;
}

interface RoomsListProps {
    rooms: ActiveRoom[];
}

function RoomsList({ rooms }: RoomsListProps) {
    const navigate = useNavigate();

    const handleRoomClick = (id: string) => {
        navigate(`/auction-room/${id}`);
    };

    return (
        <List>
            {rooms.length > 0 ? (
                rooms.map((room: ActiveRoom) => (
                    <ListItemButton key={room.id} onClick={() => handleRoomClick(room.id)}>
                        <ListItemText primary={room.id} />
                    </ListItemButton>
                ))
            ) : (
                <ListItemText primary="No Active Rooms" />
            )}
        </List>
    );
}

export default RoomsList;
