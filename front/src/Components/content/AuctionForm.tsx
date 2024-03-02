import * as React from 'react';
import { useState } from 'react';
import axios from "axios";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import SendIcon from '@mui/icons-material/Send';

const AuctionForm = () => {
    const [age, setAge] = React.useState('');

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

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };

    return (
        <Grid item xs={4}>
            <Box sx={{ bgcolor: '#474747', height: '63vh', borderRadius: 1, p: 3 }}>
                <Grid container direction="column" spacing={2}> 
                    <Grid item>
                        <FormControl fullWidth sx={{ mt: 2 }}> 
                        <InputLabel>Set Name</InputLabel>
                        <Select
                            value={age}
                            label="Set Name"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                        </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth>
                        <InputLabel>Card Condition</InputLabel>
                        <Select
                            value={age} 
                            label="Another Label"
                            onChange={handleChange} 
                        >
                            <MenuItem value={20}>Twenty</MenuItem>
                        </Select>
                        </FormControl>
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
                        <Box display="flex" justifyContent="flex-end"> {/* This Box will push the button to the right */}
                            <Button onClick={handleSubmit} variant="contained" endIcon={<SendIcon />}>
                                Create Room
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    )
}

export default AuctionForm;