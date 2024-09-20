import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Paper } from '@mui/material';

function Followers() {
  const { userId } = useParams();
  const [followers, setFollowers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      setIsLoaded(false);
      try {
        const response = await fetch(`/followers/followers/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch followers');
        const data = await response.json();
        setFollowers(data.data || []); // Ensure data structure matches the API response
      } catch (error) {
        setError(error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchFollowers();
  }, [userId]);

  if (!isLoaded) return <CircularProgress />;

  return (
    <Container maxWidth="md" style={{ padding: '20px' }}>
      {error ? (
        <div>Error: {error.message}</div>
      ) : (
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Followers
          </Typography>
          <List>
            {followers.length > 0 ? (
              followers.map(follower => (
                <ListItem key={follower.id}>
                  <ListItemText primary={follower.followerUserName} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No followers available" />
              </ListItem>
            )}
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default Followers;
