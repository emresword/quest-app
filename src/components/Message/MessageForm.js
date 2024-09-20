import React, { useState, useEffect } from 'react';
import { Button, OutlinedInput, InputAdornment, CardContent, Snackbar, Alert } from '@mui/material';

export default function MessageForm({ refreshMessages, receiverUserId }) {
    const [text, setText] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [senderUserId, setSenderUserId] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const senderId = localStorage.getItem('userId'); // Get sender's ID from localStorage
        if (senderId && receiverUserId) {
            setSenderUserId(senderId);
        } else {
            setErrorMessage("User ID or Receiver ID is not available.");
        }
    }, [receiverUserId]); // Rerun effect when receiverUserId changes

    const saveMessage = async () => {
        if (!senderUserId || !receiverUserId) {
            setErrorMessage("Sender or Receiver User ID is not available.");
            return;
        }

        try {
            const response = await fetch("/messages/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    senderUserId,
                    receiverUserId: Number(receiverUserId), // Convert to number if needed
                    text,
                }),
            });
            const result = await response.json();
            console.log("Save message response:", result); // Log response for debugging

            if (response.ok && result.success) {
                setOpenSnackbar(true);
                setText("");
                refreshMessages();
            } else {
                setErrorMessage(result.message || "Failed to send message.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setErrorMessage("Error: " + error.message);
        }
    };

    const handleSubmit = () => {
        if (text.trim() === "") {
            setErrorMessage("Message cannot be empty!");
            return;
        }
        saveMessage();
    };

    const handleCloseSnackbar = () => setOpenSnackbar(false);

    return (
        <div>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Snackbar
                autoHideDuration={6000}
                open={openSnackbar}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Message submitted successfully!
                </Alert>
            </Snackbar>

            <CardContent>
                <OutlinedInput
                    multiline
                    placeholder="Type your message here"
                    inputProps={{ maxLength: 250 }}
                    fullWidth
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                            >
                                Send
                            </Button>
                        </InputAdornment>
                    }
                />
            </CardContent>
        </div>
    );
}
