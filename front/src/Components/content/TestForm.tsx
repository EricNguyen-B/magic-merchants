import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel } from '@mui/material';
import Paper from '@mui/material/Paper';
import CardMedia from '@mui/material/CardMedia';
import Navbar from '../common/Navbar';
import ClippedDrawer from "../common/Sidebar";
import HomeContent from './HomeContent';
import RoomsGrid from './RoomsGrid';
import axios from '../../../node_modules/axios/index';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const TestForm = () => {
    // https://api.magicthegathering.io/v1/cards

    const testMagicAPI = async () => {
        const response = await axios.get('https://api.magicthegathering.io/v1/cards');
        console.log(response.data);
    }
     
    return (
        <>
            <Grid
                container 
                direction="column"
                style={{ height: '100vh' }}
                className="homepage-container"
            >
                <Grid item>
                    <Navbar />
                </Grid>
                
                <Grid
                    item 
                    container 
                    style={{ flexGrow: 1 }}
                >
                    <Button onClick={testMagicAPI}>Hello World</Button>
                </Grid>
            </Grid>
        </>
    );
}

export default TestForm;