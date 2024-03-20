import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination
} from '@mui/material';

interface Row {
  name: string;
  condition: string;
  bidPrice: string;
  purchaseDate: string;
  seller: string;
}

const createData = (name: string, condition: string, bidPrice: string, purchaseDate: string, seller: string): Row => {
  return { name, condition, bidPrice, purchaseDate, seller };
}

const rows: Row[] = [
  createData('Black Lotus', 'Near Mint', '$20000', '01/04/2021', 'JohnDoe'),
  createData('Black Lotus', 'Near Mint', '$20000', '01/04/2021', 'JohnDoe'),
  createData('Mox Pearl', 'Lightly Played', '$15000', '12/03/2021', 'JaneSmith'),
  createData('Black Lotus', 'Near Mint', '$20000', '01/04/2021', 'JohnDoe'),
  createData('Mox Pearl', 'Lightly Played', '$15000', '12/03/2021', 'JaneSmith'),
  createData('Black Lotus', 'Near Mint', '$20000', '01/04/2021', 'JohnDoe'),
  createData('Black Lotus', 'Near Mint', '$20000', '01/04/2021', 'JohnDoe'),
  createData('Mox Pearl', 'Lightly Played', '$15000', '12/03/2021', 'JaneSmith'),
];

const Inventory: React.FC = () => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('bidPrice');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Handle request sort function
  const handleRequestSort = (property: string) => {
    const isAscending = orderBy === property && order === 'asc';
    setOrder(isAscending ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sort the rows
  const sortedRows = rows.sort((a, b) => {
    const orderByKey = orderBy as keyof Row;
    const compareValue = (a[orderByKey] as string).localeCompare(b[orderByKey] as string);
    return order === 'asc' ? compareValue : -compareValue;
});

  // Change page
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Change rows per page
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
    return (
      <Box sx={{ maxWidth: '80%', mx: 'auto', mt: 10 }}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'condition'}
                    direction={orderBy === 'condition' ? order : 'asc'}
                    onClick={() => handleRequestSort('condition')}
                  >
                    Condition
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'bidPrice'}
                    direction={orderBy === 'bidPrice' ? order : 'asc'}
                    onClick={() => handleRequestSort('bidPrice')}
                  >
                    Bid Price
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'purchaseDate'}
                    direction={orderBy === 'purchaseDate' ? order : 'asc'}
                    onClick={() => handleRequestSort('purchaseDate')}
                  >
                    Purchase Date
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'seller'}
                    direction={orderBy === 'seller' ? order : 'asc'}
                    onClick={() => handleRequestSort('seller')}
                  >
                    Seller
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell component="th" scope="row">{row.name}</TableCell>
                  <TableCell align="right">{row.condition}</TableCell>
                  <TableCell align="right">{row.bidPrice}</TableCell>
                  <TableCell align="right">{row.purchaseDate}</TableCell>
                  <TableCell align="right">{row.seller}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    );
  }

export default Inventory;
