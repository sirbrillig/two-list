/* @format */
import React from 'react';
import LoggedOut from './logged-out';
import LoggedIn from './logged-in';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { useAuth0 } from './react-auth0-wrapper';
import { NoticesProvider, Notices } from './notices';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Paper';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Logo from './logo';

import './app.css';
import useStyles from './style';

const voyageurBlue = {
  main: '#5989c1',
  dark: '#225c90',
  light: '#8bb9f4',
  contrastText: '#ffffff',
};

const voyageurGrey = {
  main: '#343435',
  dark: '#0d0d0f',
  light: '#5e5e5f',
  contrastText: '#ffffff',
};

export default function AppContainer() {
  const theme = createMuiTheme({
    palette: { primary: voyageurBlue, secondary: voyageurGrey },
  });
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}

export function App() {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    loading,
    loginError,
  } = useAuth0();
  const classes = useStyles();
  return (
    <NoticesProvider>
      <MainArea
        loading={loading}
        isAuthenticated={isAuthenticated}
        logout={logout}
        loginWithRedirect={loginWithRedirect}
        loginError={loginError}
        classes={classes}
      />
      <Notices classes={classes} />
    </NoticesProvider>
  );
}

function MainArea({
  loading,
  isAuthenticated,
  logout,
  loginWithRedirect,
  loginError,
  classes,
}) {
  if (loading) {
    return (
      <Container className={classes.loggedOutRoot}>
        <Card elevation={1} className={classes.loggedOut}>
          <div className={classes.loggedOutHeader}>
            <CardHeader title="Voyageur" subheader="Log In" />
            <Logo className={classes.loggedOutLogo} />
          </div>
          <Divider />
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        </Card>
      </Container>
    );
  }
  if (isAuthenticated) {
    return <LoggedIn classes={classes} logOut={() => logout()} />;
  }
  return (
    <LoggedOut
      classes={classes}
      loginError={loginError}
      logIn={() => loginWithRedirect({})}
    />
  );
}
