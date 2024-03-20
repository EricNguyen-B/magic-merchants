import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

interface MTGCardProps {
  imageUrl: string;
}
const MTGCard: React.FC<MTGCardProps> = ({ imageUrl }) => {
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

export default MTGCard;
