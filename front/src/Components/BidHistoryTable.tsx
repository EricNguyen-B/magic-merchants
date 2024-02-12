import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface Bid {
    auctionId: string,
}

const BidHistoryTable = (bids : Bid[]) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Auction Room ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bids.map((bid: Bid) => (
            <TableRow>
              <TableCell component="th" scope="row">
                {bid.auctionId}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BidHistoryTable;