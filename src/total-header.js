import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import useStyles from './style';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function TotalHeader({ totalDistance }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <AppBar className={classes.totalHeaderAppBar}>
        <DialogTitle className={classes.totalHeaderTitle}>Total</DialogTitle>
        {totalDistance} miles
      </AppBar>
    </React.Fragment>
  );
}
