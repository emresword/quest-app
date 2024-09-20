import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { InputAdornment, OutlinedInput, Button, Snackbar, Alert } from "@mui/material";

// Styles
const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: '400px',
    margin: '16px auto',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
}));

const PostContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
});

const TitleInput = styled(OutlinedInput)({
    marginBottom: '16px',
});

const ContentInput = styled(OutlinedInput)({
    marginBottom: '16px',
});

const SubmitButton = styled(Button)({
    alignSelf: 'flex-end',
    marginTop: '16px',
});

function Postform({ userId, userName, refreshPosts }) {
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const savePost = () => {
        const token = localStorage.getItem('token');
        fetch("/posts/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, userId, text }),
        })
        .then(res => res.json())
        .then(() => {
            setOpenSnackbar(true);
            setText("");
            setTitle("");
            refreshPosts();
        })
        .catch(err => console.error("Error saving post:", err));
    };

    const handleSubmit = () => {
        if (title && text) {
            savePost();
        } else {
            console.error("Title and text cannot be empty");
        }
    };

    const handleTitleChange = (event) => setTitle(event.target.value);
    const handleTextChange = (event) => setText(event.target.value);

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
                    Post added successfully!
                </Alert>
            </Snackbar>

            <PostContainer>
                <StyledCard>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                {userName.charAt(0).toUpperCase()}
                            </Avatar>
                        }
                        titleTypographyProps={{ align: 'center' }}
                        title={<Typography variant="h6">Create Post</Typography>}
                    />
                    <CardContent>
                        <TitleInput
                            placeholder="Title"
                            fullWidth
                            value={title}
                            onChange={handleTitleChange}
                            startAdornment={<InputAdornment position="start">Title</InputAdornment>}
                        />
                        <ContentInput
                            placeholder="Post Content"
                            fullWidth
                            multiline
                            rows={4}
                            value={text}
                            onChange={handleTextChange}
                            startAdornment={<InputAdornment position="start">Content</InputAdornment>}
                        />
                        <SubmitButton variant="contained" color="primary" onClick={handleSubmit}>
                            Post
                        </SubmitButton>
                    </CardContent>
                </StyledCard>
            </PostContainer>
        </div>
    );
}

export default Postform;
