import Box from '@mui/material/Box';
import RoomsGrid from './RoomsGrid';

const HomeContent = () => {
    return (
        <Box sx={{ pt: 8 }}>
            <h3>Browse Rooms</h3>
            <RoomsGrid />
        </Box>
    );
}

export default HomeContent;