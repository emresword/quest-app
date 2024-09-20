import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, Button, List, ListItem, ListItemText, Typography, Container, Box, Divider } from "@mui/material";

function SearchUser() {
  const [query, setQuery] = useState(""); // Arama sorgusu
  const [results, setResults] = useState([]); // Arama sonuçları

  const handleSearch = async () => {
    try {
        const response = await fetch(`/users/searchUsers/${query}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // Correct format
            },
          });
          
      if (response.ok) {
        const data = await response.json(); // Convert the response to JSON
        setResults(data.data); // Assuming `data.data` contains the list of users
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("An error occurred!", error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Search for Users
      </Typography>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        marginBottom={2}
      >
        <TextField
          label="Search by username"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Input'tan sorgu al
        />
        <Button onClick={handleSearch} variant="contained" color="primary">
          Search
        </Button>
      </Box>

      {results.length > 0 && (
        <Typography variant="h6" gutterBottom>
          Search Results:
        </Typography>
      )}

      <List>
        {results.length > 0 ? (
          results.map((user) => (
            <div key={user.id}>
              <ListItem>
                <Link to={`/users/${user.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <ListItemText primary={user.userName} />
                </Link>
              </ListItem>
              <Divider />
            </div>
          ))
        ) : (
          <Typography variant="body1" align="center" color="textSecondary">
            No users found.
          </Typography>
        )}
      </List>
    </Container>
  );
}

export default SearchUser;
