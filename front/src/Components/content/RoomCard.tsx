import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import {CardActionArea, CardContent, CardActions, CardMedia, Button, Typography, CardHeader, IconButton, IconButtonProps} from '@mui/material';
import { Room } from '../../types';
import { green, red } from '@mui/material/colors';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PodcastsIcon from '@mui/icons-material/Podcasts';

const RoomCard = (room : Room ) => {
    const navigate = useNavigate();
    const [viewerCount, setViewerCount] = useState<number>(0);
    const [currentBidPrice, setCurrentBidPrice] = useState<string>("");

    const handleNavigateToAuctionRoom = () => {
        navigate(`/auction-room`, {state: room});
    };

    return (
        <Card sx={{ maxWidth: 345, width: '100%', height: '100%' }}>
            <CardHeader
                avatar={
                    room.is_active? (
                        <EventAvailableIcon sx={{color: green[500]}}></EventAvailableIcon>
                    ):
                    (
                        <EventBusyIcon sx={{color: red[500]}}></EventBusyIcon>
                    )
                }
                action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                title={`Product: ${room.card_name}`}
                subheader={`Condition: ${room.card_condition}`}
            ></CardHeader>
            <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia 
                    component="img"
                    sx={{ height: 0, paddingTop: '56.25%' }}
                    image=""
                    alt="Thumbnail"
                    onClick={handleNavigateToAuctionRoom}
                />
                <CardContent sx={{ flexGrow: 1}}>
                    <PodcastsIcon>Hello</PodcastsIcon>
                    <p>{viewerCount} Watching</p>
                </CardContent>
              
            </CardActionArea>
        </Card>
    );
}

export default RoomCard;
