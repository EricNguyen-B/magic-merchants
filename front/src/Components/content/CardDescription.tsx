import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MTGCard from './MTGCard';

const CardDescription = () => {
    const [price, setPrice] = useState<number>(0);
    const [condition, setCondition] = useState("Condition");
    const testImg = "https://imageio.forbes.com/specials-images/imageserve/5ee17b69298ad300068f40d3/-Invoke-Prejudice--is-one-of-seven-cards-to-be-removed-from-the-game-/960x0.png?format=png&width=960";

    return (
        <Grid item xs={3}>
            <Box sx={{ bgcolor: '#474747', height: '60vh', borderRadius: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                <MTGCard imageUrl={testImg} />
                <Grid container justifyContent="center" alignItems="center" spacing={1}>
                    <Grid item> 
                        <Typography variant="h6" component="h1">
                            {price}
                        </Typography>
                    </Grid>
                    <Grid item> 
                        <Typography variant="subtitle1" component="h2">
                            {condition}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    );
}

export default CardDescription;