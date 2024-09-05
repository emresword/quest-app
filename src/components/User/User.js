import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import { Grid, Typography, Paper, Container, List, ListItem, ListItemText } from '@mui/material';

function User() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    const refreshUser = () => {
        fetch(`/users/${userId}`)
            .then(res => res.json())
            .then(
                (result) => {
                    setUser(result.data);
                    return fetch(`/users/${userId}/posts`); // Fetch posts after getting user data
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
            .then(res => res.json())
            .then(
                (result) => {
                    setPosts(result.data || []); // Ensure posts is set to an empty array if undefined
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );
    };

    const handleChangeAvatar = (newAvatarId) => {
        fetch(`/users/${userId}/updateAvatar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ avatarId: newAvatarId }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Avatar updated successfully:', data);
                refreshUser(); // Refresh user data to reflect the change
            })
            .catch(error => {
                console.error('Error updating avatar:', error);
            });
    };

    useEffect(() => {
        refreshUser();
    }, [userId]);

    return (
        <div>
            {isLoaded ? (
                error ? (
                    <div>Error: {error.message}</div>
                ) : (
                    user ? (
                        <Container maxWidth={false} style={{ padding: '20px', width: '100%' }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                                        <Avatar
                                            username={user.userName}
                                            selectedAvatar={user.avatarId || 0}
                                            handleChangeAvatar={handleChangeAvatar}
                                        />
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Grid container spacing={3} direction="column">
                                        <Grid item>
                                            <Paper elevation={3} style={{ padding: '20px' }}>
                                                <Typography variant="h5" gutterBottom>
                                                    User {userId}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Name: {user.userName}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item>
                                            <Paper elevation={3} style={{ padding: '20px' }}>
                                                <Typography variant="h6" gutterBottom>
                                                    Posts
                                                </Typography>
                                                <List>
                                                    {Array.isArray(posts) && posts.length > 0 ? (
                                                        posts.map(post => (
                                                            <ListItem key={post.id}>
                                                                <ListItemText
                                                                    primary={post.title}
                                                                    secondary={post.text}
                                                                />
                                                            </ListItem>
                                                        ))
                                                    ) : (
                                                        <ListItem>
                                                            <ListItemText primary="No posts available" />
                                                        </ListItem>
                                                    )}
                                                </List>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Container>
                    ) : (
                        <div>User not found</div>
                    )
                )
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default User;
