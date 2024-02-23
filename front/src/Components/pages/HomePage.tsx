import React from "react";
import Grid from '@mui/material/Grid';
import Content from "../Content";
import TopNavBar from "../TopNavBar";
import Sidebar from "../Sidebar";
import '../../styles/HomePage.css';

const HomePage = () => {
    return (
        <Grid container direction="column" style={{ height: '100vh' }} className="homepage-container">
            <Grid item> {/* TopNavBar will take the size it requires */}
                <TopNavBar />
            </Grid>
            <Grid item container style={{ flexGrow: 1 }}> {/* Remaining space is for sidebar and content */}
                <Grid item xs={2}> {/* Assuming Sidebar takes 2 out of 12 columns */}
                    <Sidebar />
                </Grid>
                <Grid item xs={10}> {/* Content takes the rest of the space */}
                    <Content />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default HomePage;
