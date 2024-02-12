import { useState, useEffect } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function RoomsPage() {
    const navigate = useNavigate(); 

    const handleSubmit = async (event) => {
        try {
            const response = await axios.post("/api/add-auction");
            navigate(`/auctions/${response.data.id}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Button variant="contained" onClick={handleSubmit}>Add Auction Room</Button>
    );
}

export default RoomsPage;
