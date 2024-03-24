import { useEffect, useState } from 'react';
import { useCardStore, CardState } from '../../stores/CardStore';
import * as ENV from '../utils/Environment';
import axios from "axios";
import { TextField, Box, Button, Grid, InputLabel, InputAdornment, MenuItem, FormControl, Select, SelectChangeEvent } from '@mui/material';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

interface CardSet {
    code: string;
    name: string;
}
  
interface CardOption {
    id: string;
    name: string;
}

type AuctionFormProps = {
    setSelectedImageUrl: string;
    setSelectedCardCondition: string;
    setPrice: string;
}

const CardCounter = () => {
    const numCards = useCardStore((state) => state.cards);
    return <h1>Number of Cards: {numCards}</h1>
}

const CardPrice = () => {
    const cardPrice = useCardStore((state) => state.price);
    return <Typography>Card Price: {cardPrice}</Typography>
}

const SelectedCard = () => {
    const selectedCard = useCardStore((state) => state.selectedCard);
    return <Typography>Selected Card: {selectedCard}</Typography>
}

const Controls = () => {
    const increaseNumCards = useCardStore((state: CardState) => state.increase);
    const selectCard = useCardStore((state: CardState) => state.select);
    const increasePrice = useCardStore((state: CardState) => state.price);
    return (
        <Grid>
            <Button 
                onClick={() => increaseNumCards(1)}
                variant="contained"
            >
                One Up
            </Button>
            <Button
                onClick={() => selectCard("Goodbye World")}
                variant="contained"
            >
                Change String
            </Button>
            <Button
                onClick={() => selectCard("Goodbye World")}
                variant="contained"
            >
                Change String
            </Button>
        </Grid>
    );
}

const AuctionForm = ({ setSelectedImageUrl, setSelectedCardCondition, setPrice } : AuctionFormProps) => {
    const [cardSets, setCardSets] = useState<CardSet[]>([]);
    const [selectedSet, setSelectedSet] = useState<string>("");
    const [selectedCard, setSelectedCard] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [cardOptions, setCardOptions] = useState<CardOption[]>([]);
    const [cardCondition, setCardCondition] = useState<string>("");
    const [startDateValue, setStartDateValue] = useState<Dayjs | null>(dayjs());
    const [endDateValue, setEndDateValue] = useState<Dayjs | null>(dayjs().add(1, "hour"));
    const [cardNameValue, setCardNameValue] = useState<string>("");
    const [cardConditionValue, setCardConditionValue] = useState<string>("");
    const [minBidPriceValue, setMinBidPriceValue] = useState<number>(0);
    const [minBidIncrementValue, setMinBidIncrementValue] = useState<number>(0);
    const navigate = useNavigate();
    const [cookies] = useCookies(['user_email']);

    useEffect(() => {
        const getCardSets = async () => {
            try {
                const response = await axios.get(`${ENV.getServerURL()}/api/get-sets`);
                if (response.data && Array.isArray(response.data)) {
                    setCardSets(response.data);
                } else {
                    console.error('Unexpected response format:', response.data);
                }
            } catch (error) {
                console.error('Failed to fetch card sets:', error);
            }
        };
        getCardSets();
    }, []);
    
    useEffect(() => {
        const getCardsBySet = async () => {
            if (!selectedSet) {
                return;
            }
            try {
                const response = await axios.get(`${ENV.getServerURL()}/api/get-cards/${selectedSet}`);
                if (response.data && Array.isArray(response.data)) {
                    setCardOptions(response.data);
                } else {
                    console.error('Unexpected response format:', response.data);
                }
            } catch (error) {
                console.error("Failed to fetch cards for set:", error);
            }
        };
        getCardsBySet();
    }, [selectedSet]);
    
    const handleFormSubmit = async function(){
        console.log("Submit Clicked");
        try{
            await axios.post(`${ENV.getServerURL()}/api/add-auction`, {
                sellerEmail: cookies.user_email,
                dateStart: startDateValue,
                dateEnd: endDateValue,
                cardName: selectedCard,
                cardCondition: cardCondition,
                minBidPrice: minBidPriceValue,
                minBidIncrement: minBidIncrementValue,
                imageUrl: selectedImage
            }).then(res => {
                console.log(res.data);
                setStartDateValue(dayjs());
                setEndDateValue(dayjs().add(1, "hour"));
                setCardNameValue("");
                setCardConditionValue("");
                setMinBidPriceValue(0);
                setMinBidIncrementValue(0);
                setSelectedImage("");

                const room = {
                    sellerEmail: cookies.user_email,
                    dateStart: startDateValue,
                    dateEnd: endDateValue,
                    cardName: cardNameValue,
                    cardCondition: cardConditionValue,
                    minBidPrice: minBidPriceValue,
                    minBidIncrement: minBidIncrementValue,
                    imageUrl: selectedImage
                }
            
                navigate(`/auction-room`, {state: room});
                
            });
            
        }catch(error){
            console.log(error);
        }
    }

    const handleSetChange = (event: SelectChangeEvent) => {
        setSelectedSet(event.target.value as string);
    };

    const handleCardChange = (event: SelectChangeEvent) => {
        const cardName = event.target.value;
        setSelectedCard(cardName);
    
        // Find the card in cardOptions and update imageUrl
        const selectedCard = cardOptions.find(card => card.name === cardName);
        if (selectedCard && selectedCard.imageUrl) {
            setSelectedImageUrl(selectedCard.imageUrl);
            setSelectedImage(selectedCard.imageUrl);
            console.log(selectedCard.imageUrl);
        }
    };
    
    const handleConditionChange = (event: SelectChangeEvent) => {
        setCardCondition(event.target.value);
        setSelectedCardCondition(event.target.value); // Update card condition in parent state
    };

    return (
        <Grid item xs={4}>
            <Box sx={{ bgcolor: '#474747', height: '80vh', borderRadius: 1, p: 3 }}>
                <Grid container direction="column" spacing={2}> 
                    <Grid item>
                        <FormControl fullWidth sx={{ mt: 2 }}> 
                        <InputLabel>Set Name</InputLabel>
                        <Select
                            value={selectedSet}
                            label="Set Name"
                            onChange={handleSetChange}
                        >
                            {Array.isArray(cardSets) && cardSets.map(set => (
                                <MenuItem key={set.code} value={set.code}>
                                    {set.name}
                                </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth>
                            <InputLabel>Card Name</InputLabel>
                            <Select
                                value={selectedCard} 
                                label="Card Name"
                                onChange={handleCardChange} 
                            >
                                {cardOptions.map(card => (
                                    <MenuItem
                                        key={card.id}
                                        value={card.name}
                                    >
                                        {card.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth>
                            <InputLabel>Card Condition</InputLabel>
                            <Select
                                value={cardCondition} 
                                label="Card Condition"
                                onChange={handleConditionChange} 
                            >
                                <MenuItem value={"Mint"}>Mint</MenuItem>
                                <MenuItem value={"Near Mint"}>Near Mint</MenuItem>
                                <MenuItem value={"Played"}>Played</MenuItem>
                                <MenuItem value={"Heavily Played"}>Heavily Played</MenuItem>
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
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value, 10);
                                setMinBidPriceValue(newValue);
                                setPrice(newValue); 
                            }}
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
                            <Button onClick={handleFormSubmit} variant="contained" endIcon={<SendIcon />}>
                                Create Room
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="flex-end">
                            <Controls />
                        </Box>
                        <Box display="flex" justifyContent="flex-end">
                            <CardCounter />
                            <SelectedCard />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    )
}

export default AuctionForm;