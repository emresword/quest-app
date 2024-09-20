import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';

// Sample data fetching function
const fetchAvailableHobbies = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    return [
      { id: 1, name: 'Reading' },
      { id: 2, name: 'Traveling' },
      { id: 3, name: 'Cooking' },
      { id: 4, name: 'Gardening' },
      { id: 5, name: 'Photography' }
    ];
  } catch (error) {
    console.error('Error fetching hobbies:', error);
    return [];
  }
};

function Hobby({ open, onClose, userId }) {
  const [availableHobbies, setAvailableHobbies] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  useEffect(() => {
    const loadHobbies = async () => {
      if (open) {
        try {
          const [availableHobbiesResponse, userHobbiesResponse] = await Promise.all([
            fetchAvailableHobbies(), // Fetch sample hobbies
            fetch(`/hobbies/getByUserId/${userId}`) // Fetch user hobbies
          ]);

          if (!userHobbiesResponse.ok) {
            throw new Error('Failed to fetch user hobbies');
          }

          const userHobbiesData = await userHobbiesResponse.json();
          const userHobbies = userHobbiesData.data || [];
          const hobbyIds = userHobbies.map(hobby => hobby.hobbyId); // Use hobbyId from the response

          setAvailableHobbies(availableHobbiesResponse);
          setSelectedHobbies(hobbyIds); // Set selected hobbies based on user data
        } catch (error) {
          console.error('Error loading hobbies:', error);
          const sampleHobbies = await fetchAvailableHobbies();
          setAvailableHobbies(sampleHobbies);
        }
      }
    };

    loadHobbies();
  }, [open, userId]);

  const handleToggle = (hobbyId) => {
    setSelectedHobbies((prevSelectedHobbies) => {
      const isSelected = prevSelectedHobbies.includes(hobbyId);
      return isSelected ? prevSelectedHobbies.filter(id => id !== hobbyId) : [...prevSelectedHobbies, hobbyId];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hobbyCreateRequests = selectedHobbies.map(hobbyId => ({
      hobbyName: availableHobbies.find(hobby => hobby.id === hobbyId)?.name,
      userId: userId,
      hobbyId: hobbyId
    }));

    try {
      const response = await fetch('/hobbies/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hobbyCreateRequests),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      console.log('Hobbies added successfully:', data);
      onClose();
    } catch (error) {
      console.error('Error adding hobbies:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Your Hobbies</DialogTitle>
      <DialogContent>
        <Typography>Select your favorite hobbies:</Typography>
        <form onSubmit={handleSubmit}>
          {availableHobbies.length > 0 ? (
            availableHobbies.map((hobby) => (
              <FormControlLabel
                key={hobby.id}
                control={
                  <Checkbox
                    value={hobby.id}
                    onChange={() => handleToggle(hobby.id)}
                    checked={selectedHobbies.includes(hobby.id)}
                  />
                }
                label={hobby.name}
              />
            ))
          ) : (
            <Typography>No hobbies available</Typography>
          )}
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit Hobbies
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Hobby;
