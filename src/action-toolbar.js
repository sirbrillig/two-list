/* @format */
import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Icon from '@material-ui/core/Icon';

export default function ActionToolbar({ createNewItem, clearItems, classes }) {
  const addIcon = <Icon className={classes.addItemButton}>add_circle</Icon>;
  const clearIcon = <Icon className={classes.addItemButton}>delete_sweep</Icon>;

  return (
    <BottomNavigation showLabels className={classes.actionToolbar}>
      <BottomNavigationAction
        label="Add"
        icon={addIcon}
        onClick={createNewItem}
        className={classes.actionToolbarButton}
      />
      <BottomNavigationAction
        label="Clear"
        icon={clearIcon}
        onClick={clearItems}
        className={classes.actionToolbarButton}
      />
    </BottomNavigation>
  );
}
