import React, { useState, useEffect, useCallback } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { Link } from 'react-router-dom';
import Comment from "../Comment/Comment";
import CommentForm from "../Comment/CommentForm";

const StyledLink = styled(Link)({
  textDecoration: 'none',
});

const PostContainer = styled('div')({
  margin: '16px',
  display: 'flex',
  justifyContent: 'center',
});

const StyledCard = styled(Card)({
  width: '400px',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const CommentSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

function Post({ title, text, postId, likes, userId, userName, refreshPosts }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [isLiking, setIsLiking] = useState(false);

  // Check if the logged-in user has already liked the post
  useEffect(() => {
    const fetchLikeStatus = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId && likes) {
        const userHasLiked = likes.some((like) => like.userId === parseInt(storedUserId));
        setLiked(userHasLiked);
      }
    };
    fetchLikeStatus();
  }, [postId, likes]);

  const handleExpandClick = () => {
    setExpanded(prev => !prev);
    if (!expanded) {
      refreshComments();
    }
  };

  const handleLike = async () => {
    const storedUserId = localStorage.getItem('userId');
    const tokenKey = localStorage.getItem('tokenKey'); // Retrieve the token key from localStorage

    if (!storedUserId) {
      alert('You must be logged in to like posts.');
      return;
    }

    if (isLiking) return;

    setIsLiking(true);
    const newLiked = !liked;
    const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;

    setLiked(newLiked);
    setLikeCount(newLikeCount);

    try {
      const url = newLiked ? '/likes/add' : `/likes?userId=${storedUserId}&postId=${postId}`;
      const method = newLiked ? 'POST' : 'DELETE';
      const body = newLiked ? JSON.stringify({ userId: storedUserId, postId }) : null;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenKey}`, // Add the Authorization header with the token
        },
        body: body,
      });
      const data = await response.json();

      if (!data.success) {
        setLiked(!newLiked);
        setLikeCount(newLiked ? newLikeCount - 1 : newLikeCount + 1);
      }
    } catch (error) {
      console.error('Error updating like:', error);
      setLiked(!newLiked);
      setLikeCount(newLiked ? newLikeCount - 1 : newLikeCount + 1);
    } finally {
      setIsLiking(false);
    }
  };

  const refreshComments = useCallback(() => {
    fetch(`/comments?postId=${postId}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setCommentList(result.data || []);
        } else {
          console.error("Error fetching comments:", result.message);
        }
      })
      .catch(error => {
        console.error("Error fetching comments:", error);
      });
  }, [postId]);

  useEffect(() => {
    if (expanded) {
      refreshComments();
    }
  }, [expanded, refreshComments]);

  useEffect(() => {
    setLikeCount(likes.length);
  }, [likes]);

  const handleCommentSubmit = (newComment) => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      alert('You must be logged in to comment.');
      return;
    }

    if (!newComment.id) {
      console.error("Comment missing id:", newComment);
      return;
    }

    setCommentList(prevComments => [...prevComments, newComment]);
    refreshComments();
  };

  return (
    <PostContainer>
      <StyledCard>
        <CardHeader
          avatar={
            <StyledLink to={`/users/${userId}`}>
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {userName ? userName.charAt(0).toUpperCase() : ''}
              </Avatar>
            </StyledLink>
          }
          title={title}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {text}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites" onClick={handleLike}>
            <FavoriteIcon color={liked ? "error" : "action"} />
            <Typography variant="body2" color="text.secondary">{likeCount}</Typography>
          </IconButton>
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <CommentIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <CommentSection>
              {commentList.map(comment => (
                <Comment key={comment.id} {...comment} />
              ))}
              {localStorage.getItem('userId') && (
                <CommentForm postId={postId} onSubmit={handleCommentSubmit} />
              )}
              {!localStorage.getItem('userId') && (
                <Typography variant="body2" color="text.secondary">
                  Please log in to add comments.
                </Typography>
              )}
            </CommentSection>
          </CardContent>
        </Collapse>
      </StyledCard>
    </PostContainer>
  );
}

export default Post;
