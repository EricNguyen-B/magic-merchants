import Grid from '@mui/material/Grid';
import TopNavBar from "../common/Navbar";
import ClippedDrawer from "../common/Sidebar";
import '../../styles/HomePage.css';
import HomeContent from '../content/HomeContent';

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
            <Grid 
                item 
                container 
                style={{ flexGrow: 1 }}
            > 
                <Grid item xs={2}> 
                    <ClippedDrawer/>
                </Grid>
                <Grid item xs={10}> 
                    <HomeContent />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default HomePage;
