import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container, Typography, List, ListItem, CircularProgress, Paper, Radio, FormControlLabel, Button, Snackbar, Alert,
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';

// Fetch the following data (people the user is following)
const fetchFollowing = async (userId) => {
  const response = await fetch(`/followers/following/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch following");
  }
  return response.json();
};

// Check if the user has a flirt
const isMatchedFlirt = async (userId) => {
  try {
    const response = await fetch(`/followers/isMatchedFlirt?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error("Failed to check mutual flirt");
    }
    const result = await response.json();
    console.log("isMatchedFlirt response:", result); // Debugging line
    return result.data; // true or false
  } catch (error) {
    console.error("Error in isMatchedFlirt:", error); // Debugging line
    throw new Error(error.message);
  }
};

// Find if the user has a flirt (returns boolean)
const checkMutualFlirt = async (userId, flirtId) => {
  try {
    const response = await fetch(`/followers/findMutualFlirt?userId=${userId}&flirtId=${flirtId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error("Failed to check mutual flirt");
    }
    const result = await response.json();
    console.log("checkMutualFlirt response:", result); // Debugging line
    return result.data; // true or false
  } catch (error) {
    console.error("Error in checkMutualFlirt:", error); // Debugging line
    throw new Error(error.message);
  }
};

// Set a user as flirt (POST request)
const setFlirtId = async (userId, flirtId) => {
  const response = await fetch(`/followers/setFlirtId`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, flirtId }),
  });
  return response.json();
};

function FindFlirt() {
  const { userId } = useParams(); // Get userId from URL params
  const [following, setFollowing] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFollow, setSelectedFollow] = useState(null);
  const [message, setMessage] = useState("");
  const [isMutualFlirt, setIsMutualFlirt] = useState(false);
  const [isFindFlirt, setIsFindFlirt] = useState(false); // New state for findFlirt
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoaded(false);
      try {
        const data = await fetchFollowing(userId);
        console.log("fetchFollowing response:", data); // Debugging line
        setFollowing(data.data || []);

        // Check if user has a flirt
        const matchedFlirt = await isMatchedFlirt(userId);
        console.log("isMatchedFlirt result:", matchedFlirt); // Debugging line
        setIsFindFlirt(matchedFlirt); // Set boolean value directly
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchData();
  }, [userId]);

  const handleRadioChange = (event) => {
    const followId = event.target.value;
    const followObj = following.find(follow => follow.id.toString() === followId);
    setSelectedFollow(followObj || null);
  };

  const handleSetFlirt = async () => {
    if (!selectedFollow || !selectedFollow.id) {
      setMessage("Please select a user to flirt with.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await setFlirtId(userId, selectedFollow.followedUserId);
      console.log("setFlirtId response:", response); // Debugging line
      setMessage(response.success ? "Flirt set successfully!" : response.message);
      setSnackbarOpen(true);

      const isMutual = await checkMutualFlirt(userId, selectedFollow.followedUserId);
      console.log("checkMutualFlirt result:", isMutual); // Debugging line
      setIsMutualFlirt(isMutual);
      
      setMessage(isMutual ? "Mutual flirt! You can message now." : "Flirt is not mutual yet.");
      setSnackbarOpen(true);
    } catch (error) {
      setMessage("Failed to set flirt. Try again.");
      setSnackbarOpen(true);
    }
  };

  if (!isLoaded) return <CircularProgress />;

  return (
    <Container maxWidth="md" style={{ padding: '20px' }}>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>Following</Typography>
          <List>
            {following.length > 0 ? (
              following.map(follow => (
                <ListItem key={follow.id} dense>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedFollow?.id === follow.id}
                        onChange={handleRadioChange}
                        value={follow.id.toString()}
                        name="follow-radio"
                      />
                    }
                    label={follow.followedUserName}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem><Typography>No users followed</Typography></ListItem>
            )}
          </List>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSetFlirt}
            disabled={!selectedFollow?.id}
            style={{ marginTop: '20px' }}
          >
            Set as Flirt
          </Button>

          {/* Link for messaging */}
          {isMutualFlirt && isFindFlirt ? (
            <RouterLink
              to={`/messages/${selectedFollow?.id}`}
              style={{ display: 'flex', alignItems: 'center', marginTop: '20px', textDecoration: 'none' }}
            >
              <MessageIcon style={{ marginRight: '0.5rem' }} />
              <Button
                variant="contained"
                color="secondary"
              >
                Message
              </Button>
            </RouterLink>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              disabled
              style={{ marginTop: '20px' }}
            >
              Message
            </Button>
          )}

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={message.includes("Failed") ? "error" : "success"}>
              {message}
            </Alert>
          </Snackbar>
        </Paper>
      )}
    </Container>
  );
}

export default FindFlirt;
