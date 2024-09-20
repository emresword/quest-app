// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import Avatar from "../Avatar/Avatar";
// import { Grid, TextField,Typography, Paper, Container, List, ListItem, ListItemText, CircularProgress, Button } from '@mui/material';

// function User() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [error, setError] = useState(null);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [followersCount, setFollowersCount] = useState(0);
//   const [followingCount, setFollowingCount] = useState(0);
//   const [editDescription, setEditDescription] = useState(false);
//   const [newDescription, setNewDescription] = useState('');

//   const token = localStorage.getItem('token');
//   const loggedInUserId = localStorage.getItem('userId');

//   const refreshUser = useCallback(async () => {
//     setIsLoaded(false);

//     try {
//       const responses = await Promise.all([
//         fetch(`/users/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
//         fetch(`/users/${userId}/posts`, { headers: { 'Authorization': `Bearer ${token}` } }),
//         fetch(`/followers/following/${loggedInUserId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
//         fetch(`/followers/followers/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
//         fetch(`/followers/following/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } })
//       ]);

//       if (responses[0].status === 401) {
//         navigate('/login');
//         return;
//       }

//       const [userResponse, postsResponse, followResponse, followersResponse, followingResponse] = responses;

//       if (!userResponse.ok) throw new Error('Failed to fetch user data');
//       const userData = await userResponse.json();
//       setUser(userData.data);

//       if (!postsResponse.ok) throw new Error('Failed to fetch posts');
//       const postsData = await postsResponse.json();
//       setPosts(postsData.data || []);

//       const followData = await followResponse.json();
//       setIsFollowing(followData.data.some(f => f.followedUserId === parseInt(userId, 10)));

//       const followersData = await followersResponse.json();
//       setFollowersCount(followersData.data.length);

//       const followingData = await followingResponse.json();
//       setFollowingCount(followingData.data.length);

//     } catch (error) {
//       setError(error.message || 'An unexpected error occurred');
//     } finally {
//       setIsLoaded(true);
//     }
//   }, [userId, token, navigate, loggedInUserId]);

//   const handleChangeAvatar = async (newAvatarId) => {
//     try {
//       const response = await fetch(`/users/${userId}/updateAvatar`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ avatarId: newAvatarId }),
//       });
//       if (!response.ok) throw new Error('Failed to update avatar');
//       refreshUser();
//     } catch (error) {
//       console.error('Error updating avatar:', error.message);
//     }
//   };

//   const handleFollow = async () => {
//     try {
//       const response = await fetch(`/followers/follow?followerUserId=${loggedInUserId}&followedUserId=${userId}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error('Failed to follow user');
//       setIsFollowing(true);
//       setFollowersCount(prev => prev + 1);
//     } catch (error) {
//       console.error('Error following user:', error.message);
//     }
//   };

//   const handleUnfollow = async () => {
//     try {
//       const response = await fetch(`/followers/unfollow?followerUserId=${loggedInUserId}&followedUserId=${userId}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error('Failed to unfollow user');
//       setIsFollowing(false);
//       setFollowersCount(prev => prev - 1);
//     } catch (error) {
//       console.error('Error unfollowing user:', error.message);
//     }
//   };

//   const handleSaveDescription = async () => {
//     try {
//       const response = await fetch(`/users/updateDescription/${userId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ description: newDescription }),
//       });

//       if (!response.ok) throw new Error('Failed to update description');
//       refreshUser(); // Refresh user data to reflect the change
//       setEditDescription(false); // Close the description editor
//     } catch (error) {
//       setError('Error updating description: ' + error.message);
//     }
//   };

//   useEffect(() => {
//     refreshUser();
//   }, [refreshUser]);

//   if (!isLoaded) return <CircularProgress />;

//   // Inside the User component

// return (
//   <Container maxWidth="lg" style={{ padding: '20px' }}>
//     {error ? (
//       <Typography color="error">Error: {error}</Typography>
//     ) : user ? (
//       <Grid container spacing={3}>
//         <Grid item xs={12} sm={4}>
//           <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
//             <Avatar
//               username={user.userName}
//               selectedAvatar={user.avatarId || 0}
//               handleChangeAvatar={handleChangeAvatar}
//               isOwnProfile={userId === loggedInUserId}
//               isFollowing={isFollowing}
//               handleFollow={handleFollow}
//               handleUnfollow={handleUnfollow}
//               userId={userId}
//               description={user.description}
             
//             />
           
//             {userId === loggedInUserId ? (  // Only allow editing if viewing own profile
//               editDescription ? (
//                 <div>
//                   <TextField
//                       variant="outlined"
//                       fullWidth
//                       multiline
//                       rows={4}
//                       value={newDescription}
//                       onChange={(e) => setNewDescription(e.target.value)}
//                       placeholder="Update your description"
//                       style={{ marginBottom: '10px' }}
//                     />
//                   <Button onClick={handleSaveDescription} variant="contained">Save Description</Button>
//                   <Button onClick={() => setEditDescription(false)} variant="contained" color="secondary">Cancel</Button>
//                 </div>
//               ) : (
//                 <Typography>
                 
//                   <Button onClick={() => setEditDescription(true)} variant="contained">Edit Description</Button>
//                 </Typography>
//               )
//             ): null}
//             <Typography variant="body2" color="textSecondary">
//               Followers: <Button component={Link} to={`/followers/${userId}`}>{followersCount}</Button>
//               Following: <Button component={Link} to={`/following/${userId}`}>{followingCount}</Button>
//             </Typography>
//             {loggedInUserId === userId && (
//               <Typography variant="body2" color="textSecondary">
//                 Find Flirt: <Button component={Link} to={`/findFlirt/${userId}`}>{followingCount}</Button>
//               </Typography>
//             )}
//           </Paper>
//         </Grid>
//         <Grid item xs={12} sm={8}>
//           <Paper elevation={3} style={{ padding: '20px' }}>
//             <Typography variant="h5" gutterBottom>
//               Posts
//             </Typography>
//             <List>
//               {posts.length > 0 ? (
//                 posts.map(post => (
                 
//                   <ListItem key={post.id} alignItems="flex-start" style={{ marginBottom: '10px' }}>
                  
    
//                   <ListItemText
//                     primary={
//                       <Typography variant="h6" component="div">
//                         {post.title}
//                       </Typography>
//                     }
//                     secondary={
//                       <Typography variant="body2" color="textSecondary">
//                         {post.text}
//                       </Typography>
//                     }
//                   />
//                 </ListItem>
                
//                 ))
//               ) : (
//                 <ListItem>
//                   <ListItemText primary="No posts available" />
//                 </ListItem>
//               )}
//             </List>
//           </Paper>
//         </Grid>
//       </Grid>
//     ) : (
//       <Typography>No user found</Typography>
//     )}
//   </Container>
// );

// }

// export default User;
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import { Grid, TextField, Typography, Paper, Container, List, ListItem, ListItemText, CircularProgress, Button } from '@mui/material';
import Hobby from "../Hobby/Hobby"; // Import the Hobby component

function User() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [editDescription, setEditDescription] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [openHobbyDialog, setOpenHobbyDialog] = useState(false); // State to manage Hobby dialog visibility

  const token = localStorage.getItem('token');
  const loggedInUserId = localStorage.getItem('userId');

  const refreshUser = useCallback(async () => {
    setIsLoaded(false);

    try {
      const responses = await Promise.all([
        fetch(`/users/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/users/${userId}/posts`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/followers/following/${loggedInUserId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/followers/followers/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/followers/following/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (responses[0].status === 401) {
        navigate('/login');
        return;
      }

      const [userResponse, postsResponse, followResponse, followersResponse, followingResponse] = responses;

      if (!userResponse.ok) throw new Error('Failed to fetch user data');
      const userData = await userResponse.json();
      setUser(userData.data);

      if (!postsResponse.ok) throw new Error('Failed to fetch posts');
      const postsData = await postsResponse.json();
      setPosts(postsData.data || []);

      const followData = await followResponse.json();
      setIsFollowing(followData.data.some(f => f.followedUserId === parseInt(userId, 10)));

      const followersData = await followersResponse.json();
      setFollowersCount(followersData.data.length);

      const followingData = await followingResponse.json();
      setFollowingCount(followingData.data.length);

    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoaded(true);
    }
  }, [userId, token, navigate, loggedInUserId]);

  const handleChangeAvatar = async (newAvatarId) => {
    try {
      const response = await fetch(`/users/${userId}/updateAvatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ avatarId: newAvatarId }),
      });
      if (!response.ok) throw new Error('Failed to update avatar');
      refreshUser();
    } catch (error) {
      console.error('Error updating avatar:', error.message);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await fetch(`/followers/follow?followerUserId=${loggedInUserId}&followedUserId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to follow user');
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    } catch (error) {
      console.error('Error following user:', error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`/followers/unfollow?followerUserId=${loggedInUserId}&followedUserId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to unfollow user');
      setIsFollowing(false);
      setFollowersCount(prev => prev - 1);
    } catch (error) {
      console.error('Error unfollowing user:', error.message);
    }
  };

  const handleSaveDescription = async () => {
    try {
      const response = await fetch(`/users/updateDescription/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ description: newDescription }),
      });

      if (!response.ok) throw new Error('Failed to update description');
      refreshUser(); // Refresh user data to reflect the change
      setEditDescription(false); // Close the description editor
    } catch (error) {
      setError('Error updating description: ' + error.message);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  if (!isLoaded) return <CircularProgress />;

  return (
    <Container maxWidth="lg" style={{ padding: '20px' }}>
      {error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : user ? (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
              <Avatar
                username={user.userName}
                selectedAvatar={user.avatarId || 0}
                handleChangeAvatar={handleChangeAvatar}
                isOwnProfile={userId === loggedInUserId}
                isFollowing={isFollowing}
                handleFollow={handleFollow}
                handleUnfollow={handleUnfollow}
                userId={userId}
                description={user.description}
              />
              {userId === loggedInUserId ? (  // Only allow editing if viewing own profile
                editDescription ? (
                  <div>
                    <TextField
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Update your description"
                      style={{ marginBottom: '10px' }}
                    />
                    <Button onClick={handleSaveDescription} variant="contained">Save Description</Button>
                    <Button onClick={() => setEditDescription(false)} variant="contained" color="secondary">Cancel</Button>
                  </div>
                ) : (
                  <Typography>
                    <Button onClick={() => setEditDescription(true)} variant="contained">Edit Description</Button>
                  </Typography>
                )
              ) : null}
              <Typography variant="body2" color="textSecondary">
                Followers: <Button component={Link} to={`/followers/${userId}`}>{followersCount}</Button>
                Following: <Button component={Link} to={`/following/${userId}`}>{followingCount}</Button>
              </Typography>
              {loggedInUserId === userId && (
                <Typography variant="body2" color="textSecondary">
                  Find Flirt: <Button component={Link} to={`/findFlirt/${userId}`}>{followingCount}</Button>
                </Typography>
              )}
              {userId === loggedInUserId && (
                <Button variant="contained" color="primary" onClick={() => setOpenHobbyDialog(true)}>
                  Choose Hobby
                </Button>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h5" gutterBottom>
                Posts
              </Typography>
              <List>
                {posts.length > 0 ? (
                  posts.map(post => (
                    <ListItem key={post.id} alignItems="flex-start" style={{ marginBottom: '10px' }}>
                      <ListItemText
                        primary={
                          <Typography variant="h6" component="div">
                            {post.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="textSecondary">
                            {post.text}
                          </Typography>
                        }
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
      ) : (
        <Typography variant="h6">User not found</Typography>
      )}
      {openHobbyDialog && (
        <Hobby
          open={openHobbyDialog}
          onClose={() => setOpenHobbyDialog(false)}
          userId={userId}
        />
      )}
    </Container>
  );
}

export default User;
