/* @format */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { Auth0Provider } from './react-auth0-wrapper';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN, AUTH0_AUDIENCE } from './private-vars';
import registerServiceWorker from './createServiceWorker';

registerServiceWorker();

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    client_id={AUTH0_CLIENT_ID}
    redirect_uri={window.location.origin}
    audience={AUTH0_AUDIENCE}
    onRedirectCallback={onRedirectCallback}>
    <App />
  </Auth0Provider>,
  document.querySelector('#root'),
);
