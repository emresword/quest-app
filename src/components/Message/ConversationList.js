
import React, { useState, useEffect, useCallback } from 'react';
import ConversationMessage from './ConversationMessage';

function ConversationList() {
    const [conversations, setConversations] = useState([]);
    const userId = localStorage.getItem('userId');  // Assuming the userId is stored in localStorage

    const refreshConversations = useCallback(() => {
        fetch(`/messages/conversations?userId=${userId}`)
            .then(res => res.json())
            .then(result => {
                console.log("Fetch result:", result); // Log the full response data
                if (result.success) {
                    // Ensure no duplicate conversation blocks for the same users
                    const uniqueConversations = result.data.reduce((acc, conversation) => {
                        const isSender = conversation.senderUserId === Number(userId);
                        const otherUserId = isSender ? conversation.receiverUserId : conversation.senderUserId;

                        // Check if this conversation is already added (i.e. between the same two users)
                        const existingConversation = acc.find(conv => conv.otherUserId === otherUserId);
                        
                        if (!existingConversation) {
                            acc.push({
                                otherUserId,
                                otherUserName: isSender ? conversation.receiverUserName : conversation.senderUserName,
                                lastMessage: conversation.lastMessage  // You can use the last message for sorting or display purposes
                            });
                        }
                        return acc;
                    }, []);

                    setConversations(uniqueConversations);
                } else {
                    console.error("Error fetching conversations:", result.message);
                }
            })
            .catch(error => {
                console.error("Error fetching conversations:", error);
            });
    }, [userId]);

    useEffect(() => {
        refreshConversations();
    }, [refreshConversations]);

    return (
        <div>
            {conversations.map((conversation) => (
                <ConversationMessage
                    key={conversation.otherUserId} // Unique key based on the other user's ID
                    receiverUserId={conversation.otherUserId}
                    receiverUserName={conversation.otherUserName}
                />
            ))}
        </div>
    );
}

export default ConversationList;
