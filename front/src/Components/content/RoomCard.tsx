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
    const testImg = "https://imageio.forbes.com/specials-images/imageserve/5ee17b69298ad300068f40d3/-Invoke-Prejudice--is-one-of-seven-cards-to-be-removed-from-the-game-/960x0.png?format=png&width=960";

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
            <CardActionArea sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardMedia 
                    component="img"
                    sx={{
                        width: '70%', // Use 100% of the card width
                        // Use an aspect ratio that matches MTG card dimensions
                        // This is achieved by setting the height to 'auto' to maintain the aspect ratio
                        height: 'auto',
                        objectFit: 'contain', // This makes sure the whole image is shown
                    }}
                    image={testImg}
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
