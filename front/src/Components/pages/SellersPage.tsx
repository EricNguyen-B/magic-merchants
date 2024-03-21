import Navbar from "../common/Navbar";
import { Grid } from "@mui/material";
import '../../styles/HomePage.css';
import * as React from 'react';
import AuctionForm from '../content/AuctionForm';
import {CardDescription} from '../content/CardDescription';

interface RoomContentProps {
    setSelectedImageUrl: React.Dispatch<React.SetStateAction<string>>;
    imageUrl: string;
    setSelectedCardCondition: React.Dispatch<React.SetStateAction<string>>;
    cardCondition: string;
    setPrice: React.Dispatch<React.SetStateAction<number>>;
    price: number;
}

const RoomContent: React.FC<RoomContentProps> = ({
    setSelectedImageUrl,
    imageUrl,
    setSelectedCardCondition,
    cardCondition,
    setPrice,
    price
}) => {
    return (
        <React.Fragment>
            <CardDescription
                imageUrl={imageUrl}
                price={price}
                cardCondition={cardCondition}
            />
            <AuctionForm
                setSelectedImageUrl={setSelectedImageUrl}
                setSelectedCardCondition={setSelectedCardCondition}
                setPrice={setPrice} 
            />
        </React.Fragment>
    );
};

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
const SellersPage = () => {
    return (
        <Grid className="homepage-container" style={{ width: '100%', height: '100vh' }}>
            <Grid item>
                <Navbar />
            </Grid>
            <Grid style={{ flexGrow: 1 }} >
                <SellerTabs />
            </Grid>
        </Grid>
    )
}

export default SellersPage;