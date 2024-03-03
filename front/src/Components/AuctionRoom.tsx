import React from 'react';
import { useParams } from 'react-router-dom';
import BidHistoryTable from "./BidHistoryTable";
import ChatBox from './ChatBox';
import './AuctionRoomStyles.css'; // Ensure you have this CSS file

const AuctionRoom = () => {
    let { auctionId } = useParams();

    return (
        <div className="auction-room-container">
            <div className="content-area">
                <h1>Auction Room {auctionId}</h1>
                <BidHistoryTable auctionId={auctionId!} />
            </div>
            <ChatBox auctionId={auctionId!} />
        </div>
    );
}

export default AuctionRoom;
