import React from 'react';
import { useParams } from 'react-router-dom';
import BidHistoryTable from "./BidHistoryTable";

const AuctionRoom = () => {
    let { auctionId } = useParams();

    return (
        <>
            <h1>Auction Room {auctionId}</h1>
            <BidHistoryTable auctionId={auctionId!} />
        </>
    );
}

export default AuctionRoom;
