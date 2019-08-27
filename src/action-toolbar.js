/* @format */
import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Icon from '@material-ui/core/Icon';
import useStyles from './style';

export default function ActionToolbar({ createNewItem }) {
  const classes = useStyles();
  const addIcon = <Icon className={classes.addItemButton}>add_circle</Icon>;

  return (
    <BottomNavigation showLabels>
      <BottomNavigationAction
        label="Add"
        icon={addIcon}
        onClick={createNewItem}
      />
    </BottomNavigation>
  );
}
