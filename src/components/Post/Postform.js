import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { Alert, Button, InputAdornment, OutlinedInput, Snackbar } from "@mui/material";

const StyledLink = styled(Link)({
    textDecoration: 'none',
});

const PostContainer = styled('div')({
    margin: '16px',
    display: 'flex',
    justifyContent: 'center',
});

const StyledCard = styled(Card)({
    width: '250px', // Fixed width
    height: '300px', // Fixed height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Space between content and actions
});

function Postform(props) {
    const { userId, userName, refreshPosts } = props;
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const savePost = () => {
        fetch("/posts/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                userId: userId,
                text: text,
            }),
        })
            .then((res) => res.json())
            .then(() => {
                setOpenSnackbar(true);
                setText("");
                setTitle("");
                refreshPosts();
            })
            .catch((err) => console.error("error", err));
    };

    const handleSubmit = () => {
        savePost();
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <div>
            <Snackbar
                autoHideDuration={6000}
                open={openSnackbar}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Post submitted successfully!
                </Alert>
            </Snackbar>

            <PostContainer>
                <StyledCard>
                    <CardHeader
                        avatar={
                            <StyledLink to={`/users/${userId}`}>
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    {userName.charAt(0).toUpperCase()}
                                </Avatar>
                            </StyledLink>
                        }
                        titleTypographyProps={{ align: 'left' }}
                        title={
                            <OutlinedInput
                                id="title-input"
                                multiline
                                placeholder="Title"
                                fullWidth
                                value={title}
                                onChange={handleTitleChange}
                            />
                        }
                    />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                            <OutlinedInput
                                id="text-input"
                                multiline
                                placeholder="Text"
                                inputProps={{ maxLength: 250 }}
                                fullWidth
                                value={text}
                                onChange={handleTextChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#007bff', // Primary color
                                                color: '#fff', // Text color
                                                '&:hover': {
                                                    backgroundColor: '#0056b3', // Darker shade for hover
                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Shadow effect
                                                },
                                                borderRadius: '8px', // More rounded corners
                                                padding: '8px 16px', // Reduced padding
                                                textTransform: 'uppercase', // Uppercase text
                                                fontWeight: 'bold', // Bold text
                                                letterSpacing: '0.5px', // Spacing between letters
                                                transition: 'all 0.3s ease', // Smooth transition for hover effects
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Initial shadow
                                                fontSize: '0.75rem', // Smaller font size
                                                '&:focus': {
                                                    outline: 'none', // Remove default focus outline
                                                    boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.5)', // Custom focus outline
                                                }
                                            }}
                                            onClick={handleSubmit}
                                        >
                                            Post
                                        </Button>
                                    </InputAdornment>
                                }
                            />
                        </Typography>
                    </CardContent>
                </StyledCard>
            </PostContainer>
        </div>
    );
}

export default Postform;
