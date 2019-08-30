/* @format */
import React from 'react';
import CardHeader from '@material-ui/core/CardHeader';

export default function TotalHeader({ totalDistance, classes }) {
  const text = 'Total';
  const subText = `${totalDistance} miles`;
  return (
    <React.Fragment>
      <CardHeader
        classes={{ subheader: classes.totalHeaderTitle }}
        title={text}
        subheader={subText}
      />
    </React.Fragment>
  );
}
