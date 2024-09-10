import React, { useState } from 'react';
import { Button, OutlinedInput, InputAdornment, Typography, CardContent, Snackbar, Alert } from '@mui/material';

export default function MessageForm({ userId, refreshMessages }) {
    const [text, setText] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Function to save the message
    const saveMessage = () => {
        fetch("/messages/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,  // Assuming you have userId passed as a prop
                text: text,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                setOpenSnackbar(true); // Show success message
                setText(""); // Clear the input field
                refreshMessages(); // Refresh the messages (you may implement this in the parent component)
            })
            .catch((error) => console.error("Error:", error));
    };

    // Handle the submit button click
    const handleSubmit = () => {
        if (text.trim() === "") {
            alert("Message cannot be empty!");
            return;
        }
        saveMessage();
    };

    // Close Snackbar
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
                    Message submitted successfully!
                </Alert>
            </Snackbar>

            <CardContent>
                <div style={{ textAlign: 'left' }}>
                    <OutlinedInput
                        id="text-input"
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
                </div>
            </CardContent>

        </div>
    );
}
