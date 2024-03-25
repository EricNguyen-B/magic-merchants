import { useCardStore, CardState } from '../../stores/CardStore';
import { Box, Grid, Typography } from '@mui/material';
import MTGCard from './MTGCard';

const CardPrice = () => {
    const cardPrice = useCardStore((state: CardState) => state.price);
    return <Typography variant="subtitle1" component="h2">Card Condition: {cardPrice}</Typography>
}

const AuctionPrice = () => {
    const auctionPrice = useCardStore((state: CardState) => state.auctionPrice);
    return <Typography variant="subtitle1" component="h2">Auction Price: {auctionPrice}</Typography>
}

const CardImage = () => {
    const imageUrl = useCardStore((state: CardState) => state.imageUrl);
    return <MTGCard imageUrl={imageUrl} />
}

const CardDescription = () => {
    return (
        <Grid item xs={3}>
            <Box 
                sx={{ 
                    bgcolor: '#474747', 
                    height: '60vh', 
                    borderRadius: 1, 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                }}
            >
                <CardImage />
                <Grid 
                    container 
                    justifyContent="center" 
                    alignItems="center" 
                    spacing={1}
                >
                    <Grid item> 
                        <AuctionPrice />
                        <CardPrice />
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    );
}

export default CardDescription;