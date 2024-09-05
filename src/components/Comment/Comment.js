import React from "react";
import { CardContent, InputAdornment, OutlinedInput, Avatar, Typography, Link } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

// Styled components
const CommentContainer = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '8px',
  boxSizing: 'border-box',
});

const CommentAdornment = styled(InputAdornment)({
  display: 'flex',
  alignItems: 'center',
  marginRight: '8px',
});

const CommentAvatar = styled(Avatar)({
  marginRight: '8px',
  width: '32px',
  height: '32px',
});

const CommentLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
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

function Comment(props) {
  const { text, userId, userName } = props;

  return (
    <CommentContainer>
      <StyledOutlinedInput
        disabled
        multiline
        inputProps={{ maxLength: 250 }}
        fullWidth
        value={text}
        startAdornment={
          userId && userName ? (
            <CommentAdornment position="start">
              <CommentLink component={RouterLink} to={`/users/${userId}`} underline="none">
                <CommentAvatar sx={{ bgcolor: '#1976d2' }} aria-label="user-avatar">
                  {userName.charAt(0).toUpperCase()}
                </CommentAvatar>
                <Typography variant="body2" color="text.secondary">
                  {userName}
                  
                </Typography>
              </CommentLink>
            </CommentAdornment>
          ) : null
        }
      />
    </CommentContainer>
  );
}

export default Comment;
