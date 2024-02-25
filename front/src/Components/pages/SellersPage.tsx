import axios from "axios";
import Button from '@mui/material/Button';
import Navbar from "../common/Navbar";

const SellersPage = () => {
    const handleAddRoom = async () => {
        try {
            await axios.post("/api/add-auction");            
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />
            <h1>Sellers Page</h1>
            <Button 
                    onClick={handleAddRoom} 
                    variant="contained"
                >
                    Add Auction Room
            </Button>
        </>
    )
}

export default SellersPage;