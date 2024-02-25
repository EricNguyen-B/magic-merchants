import axios from "axios";
import Button from '@mui/material/Button';
import Navbar from "../common/Navbar";
import AuctionForm from "../content/AuctionForm";
import { Grid } from "@mui/material";
import '../../styles/HomePage.css';

const SellersPage = () => {
    return (
        <Grid className="homepage-container">
            <Grid item>
                <Navbar />
            </Grid>
            <Grid>
                <h1>Sellers Page</h1>
            </Grid>
            <Grid style={{
                flexGrow: 1
            }}>
                <AuctionForm/>
            </Grid>
        </Grid>
    )
}

export default SellersPage;