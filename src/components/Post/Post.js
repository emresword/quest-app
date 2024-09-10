import React, { useState, useEffect } from "react";
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
import { Container } from "@mui/material";
import Comment from "../Comment/Comment";
import CommentForm from "../Comment/CommentForm";

const StyledLink = styled(Link)({
  textDecoration: 'none',
});

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

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

function Post(props) {
  const { title, text, userId, userName, postId, likes } = props;
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [isLiking, setIsLiking] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    if (!expanded) {
      refreshComments();
    }
  };

  const handleLike = () => {
    if (isLiking) return;

    setIsLiking(true);
    const newLiked = !liked;
    const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;

    setLiked(newLiked);
    setLikeCount(newLikeCount);

    const url = newLiked ? '/likes/add' : `/likes?userId=${userId}&postId=${postId}`;
    const method = newLiked ? 'POST' : 'DELETE';
    const body = newLiked ? JSON.stringify({ userId, postId }) : null;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
      .then(response => response.json())
      .then(data => {
        if (!data.success) {
          setLiked(!newLiked);
          setLikeCount(newLiked ? newLikeCount - 1 : newLikeCount + 1);
        }
      })
      .catch(error => {
        console.error('Error updating like:', error);
        setLiked(!newLiked);
        setLikeCount(newLiked ? newLikeCount - 1 : newLikeCount + 1);
      })
      .finally(() => {
        setIsLiking(false);
      });
  };

  const checkLikes = () => {
    const isLiked = likes.some(like => like.userId === userId);
    setLiked(isLiked);
  };

  const refreshComments = () => {
    fetch(`/comments?postId=${postId}`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          if (result.success) {
            setCommentList(result.data || []);
          } else {
            console.error("Error fetching comments:", result.message);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  useEffect(() => {
    checkLikes();
  }, [likes, userId]);

  useEffect(() => {
    if (expanded) {
      refreshComments();
    }
  }, [expanded]);

  useEffect(() => {
    setLikeCount(likes.length);
  }, [likes]);

  const handleCommentSubmit = (newComment) => {
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
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </StyledLink>
          }
          titleTypographyProps={{ align: 'left' }}
          title={title}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
            {text}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={handleLike} aria-label="add to favorites" disabled={isLiking}>
            <FavoriteIcon style={{ color: liked ? "red" : "inherit", marginRight: '8px' }} />
            <Typography variant="body2" color="text.secondary">
              {likeCount}
            </Typography>
          </IconButton>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <CommentIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Container fixed>
              <CommentSection>
                {error ? "Error" : isLoaded ? (
                  commentList.length > 0 ? (
                    commentList.map(comment => (
                      <Comment
                        key={comment.id}
                        userId={comment.userId}
                        userName={comment.userName}
                        text={comment.text}
                      />
                    ))
                  ) : (
                    "No comments available"
                  )
                ) : "Loading"}
                <CommentForm userId={userId} username={userName} postId={postId} onSubmit={handleCommentSubmit} />
              </CommentSection>
            </Container>
          </CardContent>
        </Collapse>
      </StyledCard>
    </PostContainer>
  );
}

export default Post;
