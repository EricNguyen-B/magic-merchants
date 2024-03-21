import { useContext, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import axios from 'axios';
import {SocketContext} from '../../Context/SocketContext'
import { Room, Bid } from '../../types';
import * as ENV from '../utils/Environment';


const BidHistoryTable = (room: Room) => {
  const socket = useContext(SocketContext).socket;
  const [historicalBids, setHistoricalBids] = useState<Bid[]>([]);

  const checkBidHistory = async () => {
    const response = await axios.get(`${ENV.getServerURL()}/api/check-bid-history/${room.id}`);
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
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <TableContainer component={Paper} sx={{ maxWidth: 650 }}> {/* Adjust maxWidth as needed */}
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historicalBids.map((bid: Bid, index: number) => (
                <TableRow key={index}>
                  <TableCell>{bid.buyer_email}</TableCell>
                  <TableCell>{bid.price}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default BidHistoryTable;
