import * as React from 'react';
import Grid from '@mui/material/Grid';
import AuctionForm from './AuctionForm';
import CardDescription from './CardDescription';

const SellerTabs = () => {
    const [price, setPrice] = React.useState<number>(0);
    const [selectedImageUrl, setSelectedImageUrl] = React.useState('');
    const [selectedCardCondition, setSelectedCardCondition] = React.useState('');

    return (
        <Grid container spacing={3} style={{ justifyContent: 'center', marginTop: '80px' }}>
            <RoomContent
                setSelectedImageUrl={setSelectedImageUrl}
                imageUrl={selectedImageUrl}
                setPrice={setPrice}
                price={price}
                setSelectedCardCondition={setSelectedCardCondition} 
                cardCondition={selectedCardCondition}
            />
        </Grid>
    );
}

const RoomContent = ({ setSelectedImageUrl, imageUrl, setSelectedCardCondition, cardCondition, setPrice, price }) => {
    return (
        <React.Fragment>
            <CardDescription imageUrl={imageUrl} price={price} cardCondition={cardCondition} />
            <AuctionForm
                setSelectedImageUrl={setSelectedImageUrl}
                setSelectedCardCondition={setSelectedCardCondition}
                setPrice={setPrice} 
            />
        </React.Fragment>
    );
};

export default SellerTabs;
