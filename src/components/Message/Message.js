import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function Message({ text, userId }) {
    return (
        <Card sx={{ marginBottom: 2 }}>
            <CardContent>
                <Typography variant="body2" color="textSecondary">
                    User {userId}: {text}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default Message;
