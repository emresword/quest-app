import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import MessageIcon from '@mui/icons-material/Message';
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';

function Avatar({ username, selectedAvatar = 0, handleChangeAvatar, isOwnProfile, isFollowing, handleFollow, handleUnfollow, userId, description }) {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState(selectedAvatar);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleToggle = (value) => () => {
    setAvatar(value);
  };

  const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    color: "blue",
    margin: theme.spacing(1),
  }));

  const handleSave = () => {
    if (handleChangeAvatar) {
      handleChangeAvatar(avatar); // Use the function passed as a prop
    }
    handleClose();
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

 // Inside the Avatar component

return (
  <div>
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 400 }}
        image={avatar !== null ? `/avatars/avatar${avatar}.png` : "/avatars/avatar0.png"}
        title="User Avatar"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {username}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
         
        </Typography>
      </CardContent>
      {isOwnProfile && (
        <CardActions>
          <Button onClick={handleOpen} size="small">Change Avatar</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      )}
      {!isOwnProfile && (
        <CardActions>
          {isFollowing ? (
            <Button onClick={handleUnfollow} size="small" color="secondary">Unfollow</Button>
          ) : (
            <Button onClick={handleFollow} size="small" color="primary">Follow</Button>
          )}
          <StyledLink to={`/messages/${userId}`} style={{ display: 'flex', alignItems: 'center' }}>
            <MessageIcon style={{ marginRight: '0.5rem' }} /> {/* Message icon */}
            Message
          </StyledLink>
        </CardActions>
      )}
    </Card>

    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Change Avatar
        </Typography>
        <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {[0, 1, 2, 3, 4, 5, 6].map((value) => {
            const labelId = `checkbox-list-secondary-label-${value}`;
            return (
              <ListItem key={value} disablePadding>
                <ListItemButton onClick={handleToggle(value)}>
                  <ListItemAvatar>
                    <CardMedia
                      sx={{ height: 50, width: 50 }}
                      image={`/avatars/avatar${value}.png`}
                      title={`Avatar n°${value + 1}`}
                    />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={`Avatar ${value + 1}`} />
                  <Checkbox
                    edge="end"
                    checked={avatar === value}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Button onClick={handleSave} variant="contained" color="primary" sx={{ mt: 2 }}>
          Save
        </Button>
        <Button onClick={handleClose} variant="contained" color="secondary" sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  </div>
);

}

Avatar.propTypes = {
  username: PropTypes.string.isRequired,
  selectedAvatar: PropTypes.number,
  handleChangeAvatar: PropTypes.func,
  isOwnProfile: PropTypes.bool.isRequired,
  isFollowing: PropTypes.bool,
  handleFollow: PropTypes.func,
  handleUnfollow: PropTypes.func,
  userId: PropTypes.string.isRequired,
  description: PropTypes.string

};

export default Avatar;
