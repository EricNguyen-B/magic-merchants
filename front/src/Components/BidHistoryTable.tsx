import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';

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
    setHistoricalBids(response.data);
  }

  useEffect(() => {
    checkBidHistory();
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
