import { useContext, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {TextField, Select, FormControl, MenuItem, Button, InputLabel} from '@mui/material';
import axios from 'axios';
import {SocketContext} from '../../Context/SocketContext'

type Bid = {
    id: string,
    auction_id: string,
    price: number
}
interface BidHistoryTableProps {
    auctionId: string;
}

const BidHistoryTable = ({ auctionId }: BidHistoryTableProps) => {
  const socket = useContext(SocketContext).socket;
  const [historicalBids, setHistoricalBids] = useState<Bid[]>([]);
  const [bidPrice, setBidPrice] = useState<string>("");
  const [viewerCount, setViewerCount] = useState<number>(0);

  const checkBidHistory = async () => {
    const response = await axios.get(`/api/check-bid-history/${auctionId}`);
    console.log(response.data)
    setHistoricalBids(response.data);
  }
  const handleSubmitBid = () => {
    socket?.emit("sending_bid", {price: parseInt(bidPrice), auction_id: auctionId});
  }
  /**Join Room of Auction ID**/
  useEffect(() => {
    socket?.emit("joining_room", {auction_id: auctionId});
    socket?.on("recieved_bid", (data) => {checkBidHistory(); });
    socket?.on("joined_room", (data) => {setViewerCount(data['viewer_count']);});
    socket?.on("exited_room", (data) => {setViewerCount(data['viewer_count']);});
    /**Clean up socket listeners**/
    return () => {
      socket?.emit("exiting_room", {auction_id: auctionId});
      socket?.off("recieved_bid");
      socket?.off("joined_room");
      socket?.off("exited_room");
    };
  }, [socket])
  /**Check Bid History**/
  useEffect(() => {
    checkBidHistory();
  }, []); 
  
  return (
    <>
      <h1>Current Viewer Count: {viewerCount}</h1>
      <FormControl className="bid-input">
          <TextField
              label="Enter Bid Price"
              variant="outlined"
              value={bidPrice}
              type="number"
              onChange={(newValue) => setBidPrice(newValue.target.value)}
          />
      </FormControl>
      <Button 
          onClick={handleSubmitBid} 
          variant="contained">Submit
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Bid ID</TableCell>
              <TableCell>Auction ID</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
            historicalBids.map((bid: Bid, index: number) => (
              <TableRow key={index}> 
                <TableCell>{bid.id}</TableCell>
                <TableCell>{bid.auction_id}</TableCell>
                <TableCell>{bid.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default BidHistoryTable;
