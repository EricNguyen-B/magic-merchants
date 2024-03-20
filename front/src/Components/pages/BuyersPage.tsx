import Navbar from "../common/Navbar";
import Inventory from "../content/Inventory";
import Typography from '@mui/material/Typography';
import { Grid } from "@mui/material";
import '../../styles/HomePage.css';

const BuyersPage = () => {
    return (
        <Grid container className="homepage-container" style={{ width: '100%', height: '100vh' }}>
            <Grid item>
                <Navbar />
            </Grid>
            <Grid item style={{ flexGrow: 1}}>
                <Inventory/>
            </Grid>        
        </Grid>
    )
}

export default BuyersPage;