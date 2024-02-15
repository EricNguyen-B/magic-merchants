import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import {io} from 'socket.io-client';


type Bid = {
    auctionId: string,
}

interface BidHistoryTableProps {
    auctionId: string;
}

const BidHistoryTable = ({ auctionId }: BidHistoryTableProps) => {
  const [historicalBids, setHistoricalBids] = useState<Bid[]>([]);
  

  const checkBidHistory = async () => {
    const response = await axios.get(`/api/check-bid-history/${auctionId}`);
    console.log(response.data)
    setHistoricalBids(response.data);
  }
  const createBid = () => {
    //socket.emit();
  }

  useEffect(() => {
    checkBidHistory();
    const socket = io("http://localhost:3000"); //Connect to server
  }, [auctionId]); 
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Auction Room ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {historicalBids.map((bid: Bid, index: number) => (
            <TableRow key={index}> 
              <TableCell>{bid.auctionId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BidHistoryTable;
