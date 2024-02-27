import React, {useEffect, useState} from 'react';
import axios from "axios";
import { Grid, Typography, TextField, FormControlLabel, Checkbox, Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';

export default function AuctionForm() {
  const [startDateValue, setStartDateValue] = useState<Dayjs | null>(dayjs());
  const [endDateValue, setEndDateValue] = useState<Dayjs | null>(dayjs().add(1, "hour"));
  const [cardNameValue, setCardNameValue] = useState<string>("");
  const [cardConditionValue, setCardConditionValue] = useState<string>("");
  const [minBidPriceValue, setMinBidPriceValue] = useState<number>(0);
  const [minBidIncrementValue, setMinBidIncrementValue] = useState<number>(0);
  /**Handle Form Submission**/
  const handleSubmit = async function(){
    console.log("Submit Clicked");
    try{
      await axios.post("/api/add-auction", {
        dateStart: startDateValue,
        dateEnd: endDateValue,
        cardName: cardNameValue,
        cardCondition: cardConditionValue,
        minBidPrice: minBidPriceValue,
        minBidIncrement: minBidIncrementValue
    }).then(res => {
        console.log(res.data);
        setStartDateValue(dayjs());
        setEndDateValue(dayjs().add(1, "hour"));
        setCardNameValue("");
        setCardConditionValue("");
        setMinBidPriceValue(0);
        setMinBidIncrementValue(0);
    });
    }catch(error){
      console.log(error);
    }
  }
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Create Auction
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          {/**Make this a dropdown with a list of MTG cards**/}
          <TextField
            required
            id="mtg-card-name"
            label="Card Name"
            fullWidth
            value={cardNameValue}
            onChange={(newValue) => setCardNameValue(newValue.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {/**Make this a dropdown with a list of conditions**/}
          <TextField
            required
            id="mtg-card-condition"
            label="Card Condition"
            fullWidth
            value={cardConditionValue}
            onChange={(newValue) => setCardConditionValue(newValue.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Start Date"
              minDateTime={dayjs()}
              value={startDateValue}
              onChange={(newValue) => setStartDateValue(newValue)}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="End Date"
              minDateTime={startDateValue?.add(1, 'hour')}
              value={endDateValue}
              onChange={(newValue) => setEndDateValue(newValue)}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
              required
              id="min-bid-price"
              label="Minimum Bid Price"
              type="number"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              value={minBidPriceValue}
              onChange={(newValue) => setMinBidPriceValue(parseInt(newValue.target.value))}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="min-bid-increment"
            label="Minimum Bidding Increment"
            type="number"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            value={minBidIncrementValue}
            onChange={(newValue) => setMinBidIncrementValue(parseInt(newValue.target.value))}
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={handleSubmit} variant="contained" endIcon={<SendIcon />}>
            Send
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}