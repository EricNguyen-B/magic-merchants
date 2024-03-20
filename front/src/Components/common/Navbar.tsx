import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/lab/Autocomplete';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'; 
import axios from "axios";
import * as ENV from '../utils/Environment';

const Navbar = () => {
  const [activeRooms, setActiveRooms] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveRooms = async () => {
      try {
        const response = await axios.get(`${ENV.getServerURL()}/api/check-active-rooms`);
        setActiveRooms(response.data);
      } catch (error) {
        console.error('Failed to fetch active rooms:', error);
      }
    };
    fetchActiveRooms();
  }, []);

  const handleSearchChange = (_, value) => {
    setSearchValue(value);
    if (value) {
      navigate(`/auction-room`, { state: { id: value.id } });
    }
  };
  
  const handleSellerNavigation = () => {
    navigate('/sellers-page');
  }

  const handleHomeNavigation = () => {
    navigate('/');
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}> {/* This will space the items evenly */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => handleHomeNavigation()}
            sx={{ cursor: 'pointer' }}
          >
            Magic Merchants
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}> {/* Centered box for search */}
            <Autocomplete
              options={activeRooms}
              getOptionLabel={(option) => option.card_name}
              style={{ width: 300 }}
              onChange={handleSearchChange}
              renderInput={(params) => (
                <TextField {...params} label="Search active rooms" variant="outlined" />
              )}
              value={searchValue}
            />
          </Box>
          <Button variant="contained" onClick={handleSellerNavigation}>
            CREATE
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
