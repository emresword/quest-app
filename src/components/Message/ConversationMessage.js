import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    color: "blue",
    margin: theme.spacing(1),
}));

function ConversationMessage({ receiverUserId, receiverUserName }) {
    console.log("Rendering message for:", receiverUserId, receiverUserName); // Check if correct values are passed
    return (
        <Card sx={{ marginBottom: 2 }}>
            <CardContent>
                <Typography variant="body2" color="textSecondary">
                    <strong>Receiver:</strong> User Name: {receiverUserName} <br />
                    <StyledLink to={`/messages/${receiverUserId}`} style={{ display: 'flex', alignItems: 'center' }}>
                        <MessageIcon style={{ marginRight: '0.5rem' }} /> Go to Message
                    </StyledLink>
                </Typography>
            </CardContent>
        </Card>
    );
}


export default ConversationMessage;
