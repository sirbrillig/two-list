/* @format */
import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Icon from '@material-ui/core/Icon';
import useStyles from './style';

export default function ActionToolbar({ createNewItem, clearItems }) {
  const classes = useStyles();
  const addIcon = <Icon className={classes.addItemButton}>add_circle</Icon>;
  const clearIcon = <Icon className={classes.addItemButton}>delete_sweep</Icon>;

  return (
    <BottomNavigation showLabels>
      <BottomNavigationAction
        label="Add"
        icon={addIcon}
        onClick={createNewItem}
      />
      <BottomNavigationAction
        label="Clear"
        icon={clearIcon}
        onClick={clearItems}
      />
    </BottomNavigation>
  );
}
