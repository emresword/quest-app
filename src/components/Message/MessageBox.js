import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Message from './Message';
import MessageForm from './MessageForm';
import { ContactEmergency } from '@mui/icons-material';
import { Container } from '@mui/material';

export default function MessageBox() {
    const { userId } = useParams();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [messages, setMessages] = useState([]);

    const refreshMessages = async () => {
        try {
            const response = await fetch(`/messages?userId=${userId}`);
            const result = await response.json();
            if (Array.isArray(result.data)) {
                setMessages(result.data);
            } else {
                console.error("Expected an array but got", result.data);
                setMessages([]);
            }
        } catch (error) {
            setError(error);
        } finally {
            setIsLoaded(true);
        }
    };

    useEffect(() => {
        refreshMessages();
    }, [userId]);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <Container>
                    {messages.map((message) => (
                        <Message key={message.id} text={message.text} />
                    ))}
                    <MessageForm userId={userId} refreshMessages={refreshMessages} />

                </Container>

            </div>
        );
    }
}
