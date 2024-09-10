import { Link } from "react-router-dom";
import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    color: "white",
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    marginRight: theme.spacing(2),
}));

function Navbar() {
    let userId = 1; // Hardcoded userId for now

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <StyledIconButton size="large" edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                </StyledIconButton>
                <Typography variant="h6" component="div" >
                    <StyledLink to="/">Home</StyledLink>
                </Typography>
                <div>
                    <StyledLink to={`/users/${userId}`}>User</StyledLink>
                </div>
                <div>
                    <StyledLink to={`/messages/${userId}`}>Message</StyledLink>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
