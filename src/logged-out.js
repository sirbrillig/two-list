/* @format */
import Container from '@material-ui/core/Container';
import React from 'react';
import Card from '@material-ui/core/Paper';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function LoggedOut({ classes, logIn }) {
  return (
    <Container className={classes.loggedOutRoot}>
      <Card elevation={1} className={classes.loggedOut}>
        <CardHeader title="Voyageur" subheader="Log In" />
        <Divider />
        <div>
          <TextField id="username" label="Username" margin="normal" fullWidth />
        </div>
        <div>
          <TextField
            id="password"
            label="Password"
            margin="normal"
            fullWidth
            type="password"
          />
        </div>
        <div>
          <Button
            color="primary"
            onClick={logIn}
            fullWidth
            size="large"
            variant="outlined">
            Log in
          </Button>
        </div>
      </Card>
    </Container>
  );
}
