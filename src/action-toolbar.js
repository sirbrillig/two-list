/* @format */
import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Icon from '@material-ui/core/Icon';

import logo from './logo-small.png';

export default function ActionToolbar({ createNewItem, clearItems, classes }) {
  const addIcon = (
    <Icon fontSize="large" className={classes.actionToolbarButtonIcon}>
      add_circle
    </Icon>
  );
  const clearIcon = (
    <Icon fontSize="large" className={classes.actionToolbarButtonIcon}>
      delete_sweep
    </Icon>
  );

  return (
    <BottomNavigation showLabels className={classes.actionToolbar}>
      <BottomNavigationAction
        label="Add"
        icon={addIcon}
        onClick={createNewItem}
        className={`${classes.actionToolbarButton}  ${
          classes.actionToolbarAdd
        }`}
      />
      <BottomNavigationAction
        label="Clear"
        icon={clearIcon}
        onClick={clearItems}
        className={`${classes.actionToolbarButton}  ${
          classes.actionToolbarClear
        }`}
      />
      <Logo classes={classes} />
    </BottomNavigation>
  );
}

function Logo({ classes }) {
  return <img src={logo} className={classes.logo} alt="Voyageur" />;
}
