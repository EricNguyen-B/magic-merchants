import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import axios from '../../../node_modules/axios/index';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import MTGCard from './MTGCard';
import AuctionForm from './AuctionForm';
import CardDescription from './CardDescription';

const TestForm = () => {
    // https://api.magicthegathering.io/v1/cards
    const [value, setValue] = React.useState('1');

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const testMagicAPI = async () => {
        const response = await axios.get('https://api.magicthegathering.io/v1/cards');
        console.log(response.data);
    }
    
    return (
        <Grid container spacing={3} style={{ justifyContent: 'center', marginTop: '80px' }}>
            <Grid item xs={12} > 
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
            <CardDescription />
            <AuctionForm />
        </Grid>
    );
}

export default TestForm;