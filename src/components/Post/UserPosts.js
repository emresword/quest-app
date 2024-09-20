// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Container, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

// function UserPosts({posts}) {
//   const { userId } = useParams(); // Get the userId from URL parameters
 
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchPosts = async () => {
//       setIsLoaded(false);
//       try {
//         const response = await fetch(`/users/${userId}/posts`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) throw new Error('Failed to fetch posts');
//         const data = await response.json();
//         setPosts(data.data || []);
//       } catch (error) {
//         setError(error.message || 'An unexpected error occurred');
//       } finally {
//         setIsLoaded(true);
//       }
//     };

//     fetchPosts();
//   }, [userId, token]);

//   if (!isLoaded) return <CircularProgress />;
  
//   return (
//     <Container maxWidth="lg" style={{ padding: '20px' }}>
//       {error ? (
//         <Typography color="error">Error: {error}</Typography>
//       ) : (
//         <div>
//           <Typography variant="h4" gutterBottom>
//             Posts by User {userId}
//           </Typography>
//           <List>
//             {posts.length > 0 ? (
//               posts.map(post => (
//                 <ListItem button key={post.id}>
//                   <ListItemText
//                     primary={post.title}
//                     secondary={post.text}
//                   />
//                 </ListItem>
//               ))
//             ) : (
//               <ListItem>
//                 <ListItemText primary="No posts available" />
//               </ListItem>
//             )}
//           </List>
//         </div>
//       )}
//     </Container>
//   );
// }

// export default UserPosts;
