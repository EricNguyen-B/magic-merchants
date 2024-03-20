import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

interface CardDescriptionProps {
    imageUrl: string;
    cardCondition: string;
    price: number;
}
interface MTGCardProps {
  imageUrl: string;
}
export const MTGCard: React.FC<MTGCardProps> = ({ imageUrl }) => {
    const cardWidth = 250; // width in pixels
    const cardAspectRatio = 88 / 63; // height to width ratio of a standard MTG card
    const cardHeight = cardWidth * cardAspectRatio; // height in pixels
  
    return (
      <Card sx={{ 
        width: cardWidth, 
        height: cardHeight, 
        margin: 'auto', 
        marginTop: '20px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
      }}> 
        <CardMedia
            component="img"
            sx={{ 
                width: 'auto', 
                height: '100%', 
                maxHeight: cardHeight, 
            }}
            image={imageUrl != '' ? imageUrl : 'https://i.imgur.com/LdOBU1I.jpg'}
            alt="MTG Card"
        />
      </Card>
    );
};

export const CardDescription: React.FC<CardDescriptionProps>= ({ imageUrl, cardCondition, price }) => {
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