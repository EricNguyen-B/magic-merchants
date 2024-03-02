import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import {CardActionArea, CardContent, CardActions, CardMedia, Button, Typography, CardHeader, IconButton, IconButtonProps} from '@mui/material';
import { Room, Bid } from '../../types';
import { green, red } from '@mui/material/colors';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { SocketContext } from '../../Context/SocketContext';

const RoomCard = ({room, bid}:{room : Room, bid: Bid}) => {
    const socket = useContext(SocketContext).socket;
    const navigate = useNavigate();
    const [viewerCount, setViewerCount] = useState<number>(0);
    const [currentBidPrice, setCurrentBidPrice] = useState<number>(bid.price);
   
    /**Listen for Auction Room Changes**/
    useEffect(() => {
        console.log(bid);
        socket?.emit("getting_viewer_count", {auction_id: room.id});
        socket?.on(`${room.id}/view_count`, (data) => {setViewerCount(data['viewer_count'])});
        socket?.on(`${room.id}/recieved_bid`, (data) => {setCurrentBidPrice(data['bid_price'])});
        /**Clean up socket listeners**/
        return () => {
            socket?.off(`${room.id}/view_count`);
            socket?.off(`${room.id}/recieved_bid`);
        };
    }, [socket]);

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
                    <p><PodcastsIcon/>:{viewerCount}</p>
                    <p><AttachMoneyIcon/>:{currentBidPrice}</p>
                </CardContent>
              
            </CardActionArea>
        </Card>
    );
}

export default RoomCard;
