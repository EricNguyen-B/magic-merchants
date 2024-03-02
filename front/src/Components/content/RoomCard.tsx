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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { SocketContext } from '../../Context/SocketContext';

const RoomCard = ({room, bid}:{room : Room, bid: Bid}) => {
    const socket = useContext(SocketContext).socket;
    const navigate = useNavigate();
    const [viewerCount, setViewerCount] = useState<number>(0);
    const [currentBidPrice, setCurrentBidPrice] = useState<number>(bid.price);
   
    /**Listen for Auction Room Changes**/
    useEffect(() => {
        socket?.emit("getting_viewer_count", {auction_id: room.id});
        socket?.on(`${room.id}/view_count`, (data) => {setViewerCount(data['viewer_count'])});
        socket?.on(`${room.id}/recieved_bid`, (data) => {setCurrentBidPrice(data['bid_price'])});
        /**Clean up socket listeners**/
        return () => {
            socket?.off(`${room.id}/view_count`);
            socket?.off(`${room.id}/recieved_bid`);
        };
    }, [socket]);
    const testImg = "https://imageio.forbes.com/specials-images/imageserve/5ee17b69298ad300068f40d3/-Invoke-Prejudice--is-one-of-seven-cards-to-be-removed-from-the-game-/960x0.png?format=png&width=960";

    const handleNavigateToAuctionRoom = () => {
        navigate(`/auction-room`, {state: room});
    };


    return (
        <Card sx={{ maxWidth: 345, width: '100%', height: '100%' }}>
            <CardHeader
                avatar={(() => {
                        //TODO: Refactor Switch Statements into A JSX Function That Takes in 3 Components and Room as Props
                        switch (room.room_status){
                            case "active":
                                return (<EventAvailableIcon sx={{color: green[500]}}></EventAvailableIcon>)
                            case "inactive":
                                return (<EventBusyIcon sx={{color: red[500]}}></EventBusyIcon>)
                            case "complete":
                                return (<CheckCircleIcon sx={{color: green[500]}}></CheckCircleIcon>)
                            default:
                                return (<CloseIcon sx={{color: red[500]}}></CloseIcon>)
                        }
                    })()
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
                    <p><PodcastsIcon/>:{viewerCount}</p>
                    <p><AttachMoneyIcon/>:{currentBidPrice}</p>
                </CardContent>
              
            </CardActionArea>
        </Card>
    );
}

export default RoomCard;
