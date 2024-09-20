import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Message from './Message';
import MessageForm from './MessageForm';
import { Container, CircularProgress } from '@mui/material';

export default function MessageBox() {
    const { userId } = useParams(); // Get receiver's userId from the URL
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [messages, setMessages] = useState([]);

    const refreshMessages = useCallback(async () => {
        const senderUserId = localStorage.getItem('userId'); // Get the sender's userId
        if (!senderUserId || !userId) {
            setError("Sender or Receiver User ID is not available.");
            return;
        }
        try {
            const response = await fetch(`/messages?senderUserId=${senderUserId}&receiverUserId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            const result = await response.json();
            console.log("API response:", result); // Log the API response for debugging

            if (response.ok && Array.isArray(result.data)) {
                setMessages(result.data);
            } else {
                console.error("Unexpected data format:", result.data);
                setMessages([]);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError("Failed to fetch messages.");
        } finally {
            setIsLoaded(true);
        }
    }, [userId]); // Include userId in dependency array

    useEffect(() => {
        refreshMessages();
    }, [refreshMessages]); // Include refreshMessages in dependency array

    if (error) {
        return <div>Error: {error}</div>;
    } else if (!isLoaded) {
        return <CircularProgress />;
    } else {
        return (
            <Container>
                {messages.length === 0 ? (
                    <div>No messages found.</div>
                ) : (
                    messages.map((message) => (
                        <Message 
                            key={message.id} 
                            text={message.text} 
                            senderUserId={message.senderUserId} 
                            receiverUserId={message.receiverUserId} // Display receiver's ID
                        />
                    ))
                )}
                <MessageForm refreshMessages={refreshMessages} receiverUserId={userId} />
            </Container>
        );
    }
}
