/* @format */
import React from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

export default function TotalHeader({
  totalDistance,
  isLoading,
  clearItems,
  classes,
}) {
  const title = (
    <React.Fragment>
      <Icon fontSize="large" className={classes.totalHeaderIcon}>
        drive_eta
      </Icon>
      {isLoading ? 'Loading...' : `${totalDistance} miles`}
    </React.Fragment>
  );
  const subheader = (
    <React.Fragment>
      <IconButton
        classes={{ root: classes.totalHeaderButton }}
        color="inherit"
        aria-label="clear trip"
        onClick={clearItems}>
        <Icon fontSize="large">delete_sweep</Icon>
      </IconButton>
    </React.Fragment>
  );
  return (
    <CardHeader
      classes={{
        content: classes.totalHeaderContent,
        subheader: classes.totalHeaderDistance,
      }}
      title={title}
      subheader={subheader}
    />
  );
}
