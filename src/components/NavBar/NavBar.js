import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    color: "white",
    margin: theme.spacing(1),
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    marginRight: theme.spacing(2),
}));

function Navbar() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <StyledIconButton size="large" edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                </StyledIconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
                        <StyledLink to="/" style={{ display: 'flex', alignItems: 'center' }}>
                            <HomeIcon style={{ marginRight: '0.5rem' }} /> {/* Home icon */}
                            Home
                        </StyledLink>
                        {userId && (
                            <>
                                <StyledLink to={`/users/${userId}`} style={{ display: 'flex', alignItems: 'center' }}>
                                    <PersonIcon style={{ marginRight: '0.5rem' }} /> 
                                    Profile
                                </StyledLink>
                                <StyledLink to="/conversations" style={{ display: 'flex', alignItems: 'center' }}>
                                    <MessageIcon style={{ marginRight: '0.5rem' }} />
                                    Message
                                </StyledLink>
                                <StyledLink to="/searchUsers" style={{ display: 'flex', alignItems: 'center' }}>
                                    <SearchIcon style={{ marginRight: '0.5rem' }} /> 
                                    Search
                                </StyledLink>

                            </>
                        )}
                    </div>
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {!userId ? (
                        <>
                            <StyledLink to="/login">Login</StyledLink>
                            <StyledLink to="/register">Register</StyledLink>
                        </>
                    ) : (
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
