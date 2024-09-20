import React, { useState } from "react";
import { CardContent, InputAdornment, OutlinedInput, Avatar, Typography, Link, Button } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

// Styled components
const CommentContainer = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '8px',
});

const CommentAdornment = styled(InputAdornment)({
    display: 'flex',
    alignItems: 'center',
});

const CommentAvatar = styled(Avatar)({
    marginRight: '8px',
    width: '32px',
    height: '32px',
});

const CommentLink = styled(Link)({
    display: 'flex',
    alignItems: 'center',
});

const SubmitButton = styled(Button)({
    marginTop: '8px',
    alignSelf: 'flex-end',
    height: '40px',
});

const StyledOutlinedInput = styled(OutlinedInput)({
    width: '100%',
    marginTop: '8px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #c4c4c4',
    '& .MuiInputBase-input': {
        paddingLeft: '0',
    },
});

function CommentForm({ postId, onSubmit }) {
    const [commentText, setCommentText] = useState("");
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('userName');

    const handleInputChange = (event) => {
        setCommentText(event.target.value);
    };

    const handleSubmit = () => {
        if (commentText.trim()) {
            fetch(`/comments/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId, userId, text: commentText, username }),
            })
            .then(response => response.json())
            .then((result) => {
                if (result.success) {
                    onSubmit(result.data); // Ensure result.data contains the new comment with an ID
                    setCommentText("");
                } else {
                    console.error("Failed to add comment:", result.message);
                }
            })
            .catch((error) => {
                console.error("Error adding comment:", error);
            });
        }
    };

    return (
        <CommentContainer>
            <StyledOutlinedInput
                multiline
                inputProps={{ maxLength: 250 }}
                fullWidth
                value={commentText}
                onChange={handleInputChange}
                startAdornment={
                    userId && username ? (
                        <CommentAdornment position="start">
                            <CommentLink component={RouterLink} to={`/users/${userId}`} underline="none">
                                <CommentAvatar sx={{ bgcolor: '#1976d2' }} aria-label="user-avatar">
                                    {username.charAt(0).toUpperCase()}
                                </CommentAvatar>
                                <Typography variant="body2" color="text.secondary">
                                    {username}
                                </Typography>
                            </CommentLink>
                        </CommentAdornment>
                    ) : null
                }
            />
            <SubmitButton variant="contained" color="primary" onClick={handleSubmit}>
                Comment
            </SubmitButton>
        </CommentContainer>
    );
}

export default CommentForm;
