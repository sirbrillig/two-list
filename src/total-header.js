/* @format */
import React from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import Icon from '@material-ui/core/Icon';

export default function TotalHeader({ totalDistance, isLoading, classes }) {
  const subText = isLoading ? 'Loading...' : `${totalDistance} miles`;
  const title = (
    <React.Fragment>
      Total
      <Icon fontSize="large" className={classes.totalHeaderIcon}>
        drive_eta
      </Icon>
    </React.Fragment>
  );
  return (
    <CardHeader
      classes={{
        content: classes.totalHeaderContent,
        subheader: classes.totalHeaderDistance,
      }}
      title={title}
      subheader={subText}
    />
  );
}
