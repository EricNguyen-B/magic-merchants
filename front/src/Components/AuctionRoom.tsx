import React from 'react';
import { useParams } from 'react-router-dom';

const AuctionRoom = () => {
    let { auctionId } = useParams(); 

    return (
        <h1>Auction Room {auctionId}</h1>
    );
}

export default AuctionRoom;
