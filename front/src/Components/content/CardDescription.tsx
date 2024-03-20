import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MTGCard from './MTGCard';

interface CardDescriptionProps {
    imageUrl: string;
    cardCondition: string;
    price: number;
}

const CardDescription: React.FC<CardDescriptionProps>= ({ imageUrl, cardCondition, price }) => {
    return (
        <Grid item xs={3}>
            <Box sx={{ bgcolor: '#474747', height: '60vh', borderRadius: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                <MTGCard imageUrl={imageUrl} />
                <Grid container justifyContent="center" alignItems="center" spacing={1}>
                    <Grid item> 
                        <Typography variant="subtitle1" component="h2" style={{ color: 'white'}}>
                            Auction Price: {price}
                        </Typography>
                        <Typography variant="subtitle1" component="h2" style={{ color: 'white'}}>
                            Card Condition: {cardCondition} 
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    );
}

export default CardDescription;