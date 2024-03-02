import Navbar from "../common/Navbar";
import AuctionForm from "../content/SellerForm";
import { Grid } from "@mui/material";
import '../../styles/HomePage.css';
import TestForm from "../content/TestForm";

const SellersPage = () => {
    return (
        <Grid className="homepage-container" style={{ width: '100%', height: '100vh' }}>
            <Grid item>
                <Navbar />
            </Grid>
            <Grid 
                style={{ flexGrow: 1 }} 
            >
                <TestForm />
            </Grid>
        </Grid>
    )
}

export default SellersPage;