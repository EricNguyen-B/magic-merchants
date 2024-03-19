import Navbar from "../common/Navbar";
import { Grid } from "@mui/material";
import '../../styles/HomePage.css';
import SellerTabs from "../content/SellerTabs";

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