import React, { useState, useEffect } from "react";
import Post from "../Post/Post";
import { makeStyles } from "@mui/styles";
import { Container } from "@mui/material";
import Postform from "../Post/Postform";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8edff",
    padding: 0,
    margin: 0,
    minHeight: "100vh",
  }
}));

function Home() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [postList, setPostList] = useState([]);
  const classes = useStyles();

  const refreshPosts = () => {
    fetch("/posts")
      .then(res => res.json())
      .then(
        (result) => {
          if (Array.isArray(result.data)) {
            setPostList(result.data);
          } else {
            console.error("Expected an array but got", result.data);
            setPostList([]);
          }
          setIsLoaded(true);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  const loggedInUserId = localStorage.getItem('userId');
  const loggedInUserName = localStorage.getItem('userName');

  if (error) {
    return <div>Error!!!</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className={classes.container}>
        <Container>
          {loggedInUserId && loggedInUserName && (
            <Postform userId={loggedInUserId} userName={loggedInUserName} refreshPosts={refreshPosts} />
          )}
          {postList.length > 0 ? (
            postList.map(post => (
              <Post
                key={post.id}
                postId={post.id}
                userId={post.userId}
                userName={post.userName} // Ensure userName is passed
                title={post.title}
                text={post.text}
                likes={post.postLikes}
                loggedInUserId={loggedInUserId} // Ensure loggedInUserId is passed
                refreshPosts={refreshPosts}
              />
            ))
          ) : (
            <div>No posts available</div>
          )}
        </Container>
      </div>
    );
  }
}

export default Home;
