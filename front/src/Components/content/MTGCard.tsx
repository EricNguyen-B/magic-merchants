import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

const MTGCard = ({ imageUrl }) => {
    const cardWidth = 250; // width in pixels
    const cardAspectRatio = 88 / 63; // height to width ratio of a standard MTG card
    const cardHeight = cardWidth * cardAspectRatio; // height in pixels
  
    return (
      <Card sx={{ 
        width: cardWidth, 
        height: cardHeight, 
        margin: 'auto', // Centers the card horizontally in the parent container
        marginTop: '20px', // Add a top margin to the card
        display: 'flex', // Makes the card a flex container
        alignItems: 'center', // Centers the card media vertically in the card
        justifyContent: 'center', // Centers the card media horizontally in the card
      }}> 
        <CardMedia
            component="img"
            sx={{ 
                width: 'auto', // Maintains the image aspect ratio
                height: '100%', // Fills the card height
                maxHeight: cardHeight, // Ensures the image does not exceed the card height
            }}
            image={imageUrl}
            alt="MTG Card"
        />
      </Card>
    );
};

export default MTGCard;
