import { Link } from "react-router-dom";
import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles'; // Use this import

const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    color: "white",

}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    marginRight: theme.spacing(2),
}));

function Navbar() {
    let userId = 1;

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StyledIconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                    >
                        <MenuIcon />
                    </StyledIconButton>
                </div>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <StyledLink to="/">Home</StyledLink>
                </Typography>
                <div>
                    <StyledLink to={`/users/${userId}`}>User</StyledLink>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
