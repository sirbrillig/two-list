/* @format */
import Container from '@material-ui/core/Container';
import React from 'react';
import Card from '@material-ui/core/Paper';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Logo from './logo';

export default function LoggedOut({ classes, logIn, loginError }) {
  return (
    <Container className={classes.loggedOutRoot}>
      <Card elevation={1} className={classes.loggedOut}>
        <div className={classes.loggedOutHeader}>
          <CardHeader title="Voyageur" subheader="Log In" />
          <Logo className={classes.loggedOutLogo} />
        </div>
        <Divider />
        <div>
          {loginError && (
            <div className={classes.loggedOutError}>
              {loginError.toString()}
            </div>
          )}
          <Button
            color="primary"
            onClick={logIn}
            fullWidth
            size="large"
            variant="contained">
            Log in
          </Button>
        </div>
      </Card>
    </Container>
  );
}
