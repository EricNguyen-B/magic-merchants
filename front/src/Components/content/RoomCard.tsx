import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardMedia';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

interface ActiveRoomProps {
    id: string;
}

const RoomCard = ({ id }: ActiveRoomProps ) => {
    const navigate = useNavigate();

    const handleNavigateToAuctionRoom = () => {
        navigate(`/auction-room/${id}`)
    };

    return (
        <Card sx={{ maxWidth: 345, width: '100%', height: '100%' }}>
            <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia 
                    component="img"
                    sx={{ height: 0, paddingTop: '56.25%' }}
                    image=""
                    alt="Thumbnail"
                    onClick={handleNavigateToAuctionRoom}
                />
                <CardContent sx={{ flexGrow: 1}}>
                    <Typography gutterBottom variant="h5" component="div">
                        {id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Short description or other content goes here.
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default RoomCard;
