import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Paper } from '@mui/material';

function Following() {
  const { userId } = useParams();
  const [following, setFollowing] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowing = async () => {
      setIsLoaded(false);
      try {
        const response = await fetch(`/followers/following/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch following list');
        const data = await response.json();
        setFollowing(data.data || []); // Ensure data structure matches the API response
      } catch (error) {
        setError(error.message || 'An unexpected error occurred');
      } finally {
        setIsLoaded(true);
      }
    };

    fetchFollowing();
  }, [userId]);

  if (!isLoaded) return <CircularProgress />;

  return (
    <Container maxWidth="md" style={{ padding: '20px' }}>
      {error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : (
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Following
          </Typography>
          <List>
            {following.length > 0 ? (
              following.map(followedUser => (
                <ListItem key={followedUser.id}>
                  <ListItemText primary={followedUser.followedUserName} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No following available" />
              </ListItem>
            )}
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default Following;
