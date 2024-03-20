import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AuctionForm from './AuctionForm';
import CardDescription from './CardDescription';
import Inventory from './Inventory';

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

const SellerTabs: React.FC = () => {
    const [value, setValue] = React.useState('2');
    const [roomTab, setRoomTab] = React.useState(true);
    const [price, setPrice] = React.useState<number>(0);
    const [selectedImageUrl, setSelectedImageUrl] = React.useState('');
    const [selectedCardCondition, setSelectedCardCondition] = React.useState('');

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        setRoomTab(newValue === "2");
    };

    return (
        <Grid container spacing={3} style={{ justifyContent: 'center', marginTop: '80px' }}>
            <Grid item xs={12}> 
                <Box sx={{ width: '100%', typography: 'body1', display: 'flex', justifyContent: 'center' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: 'auto' }}> 
                            <TabList onChange={handleTabChange} aria-label="lab API tabs example" centered>
                                <Tab label="Create Room" value="2" />
                                <Tab label="View Inventory" value="1" />
                            </TabList>
                        </Box>
                        <TabPanel value="2">Create Room</TabPanel>
                        <TabPanel value="1">View Inventory</TabPanel>
                    </TabContext>
                </Box>
            </Grid>
            {roomTab ? (
                <RoomContent
                    setSelectedImageUrl={setSelectedImageUrl}
                    imageUrl={selectedImageUrl}
                    setPrice={setPrice}
                    price={price}
                    setSelectedCardCondition={setSelectedCardCondition} 
                    cardCondition={selectedCardCondition}
                />
            ) : (
                <Inventory />
            )}
        </Grid>
    );
}

export default SellerTabs;
