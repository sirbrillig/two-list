/* @format */
import React, { useRef, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

export default function MainToolbar({ classes, logOut }) {
  const accountMenuRef = useRef();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const onAccountMenuClick = () => setAccountMenuOpen(true);
  const onAccountMenuClose = () => setAccountMenuOpen(false);
  return (
    <AppBar position="relative" className={classes.mainToolbar}>
      <Toolbar className={classes.mainToolbarToolbar}>
        <Typography variant="h6" className={classes.mainToolbarTitle}>
          Voyageur
        </Typography>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={onAccountMenuClick}
          ref={accountMenuRef}
          color="inherit">
          <Icon fontSize="large">account_circle</Icon>
        </IconButton>
        <UserMenu
          open={accountMenuOpen}
          targetRef={accountMenuRef}
          onClose={onAccountMenuClose}
          logOut={logOut}
        />
      </Toolbar>
    </AppBar>
  );
}

function UserMenu({ targetRef, open, onClose, logOut }) {
  return (
    <Menu
      id="menu-appbar"
      anchorEl={targetRef.current}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      onClose={onClose}>
      <MenuItem onClick={onClose}>Profile</MenuItem>
      <MenuItem onClick={logOut}>Log out</MenuItem>
    </Menu>
  );
}
