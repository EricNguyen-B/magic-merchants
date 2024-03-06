import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TopNavBar from "../common/Navbar";
import SideBar from "../common/Sidebar";
import '../../styles/HomePage.css';
import RoomsGrid from '../content/RoomsGrid';

const HomePage = () => {
    return (
        <Grid 
            container 
            direction="column" 
            style={{ height: '100vh' }} 
            className="homepage-container"
        >
            <Grid item> 
                <TopNavBar />
            </Grid>
            <Grid item container style={{ flexGrow: 1 }}> 
                <Grid item xs={2}> 
                    <SideBar/>
                </Grid>
                <Grid item xs={10}> 
                <Box sx={{ pt: 8 }}>
                    <h3>Browse Rooms</h3>
                    <RoomsGrid />
                </Box>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default HomePage;
