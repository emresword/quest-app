import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';

function Message({ text, senderUserId, receiverUserId }) {
    return (
        <Card sx={{ marginBottom: 2 }}>
            <CardContent>
                <Typography variant="body2" color="textSecondary">
                    <strong>Sender:</strong> User {senderUserId} <br />
                    <strong>Receiver:</strong> User {receiverUserId} <br />
                    <strong>Message:</strong> {text}
                </Typography>
            </CardContent>
        </Card>
    );
}

Message.propTypes = {
    text: PropTypes.string.isRequired,
    senderUserId: PropTypes.number.isRequired,
    receiverUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Message;
