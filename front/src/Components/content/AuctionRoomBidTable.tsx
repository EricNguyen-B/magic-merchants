import { useContext, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import {SocketContext} from '../../Context/SocketContext'
import { Room, Bid } from '../../types';

const BidHistoryTable = (room: Room) => {
  const socket = useContext(SocketContext).socket;
  const [historicalBids, setHistoricalBids] = useState<Bid[]>([]);

  const checkBidHistory = async () => {
    const response = await axios.get(`/api/check-bid-history/${room.id}`);
    console.log(response.data)
    setHistoricalBids(response.data);
  }
  useEffect(() => {
    /**Listen to Socket Events**/
    socket?.on("recieved_bid", (data) => {checkBidHistory(); });
    /**Clean up socket listeners**/
    return () => {
      socket?.off("recieved_bid");
    };
  }, [socket])
  /**Check Bid History**/
  useEffect(() => {
    checkBidHistory();
  }, []); 
  
  return (
    <>
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
