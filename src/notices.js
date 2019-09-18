/* @format */
import React, { useState, useCallback, useContext, createContext } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const NoticeContext = createContext({ currentNotice: null });

export function useNotices() {
  const { currentNotice, setCurrentNotice } = useContext(NoticeContext);

  const showError = useCallback(
    (message, detailedMessage) => {
      console.log('Error!', message, detailedMessage);
      setCurrentNotice({
        type: 'error',
        message: message.toString ? message.toString() : message,
        detailedMessage:
          detailedMessage && detailedMessage.toString
            ? detailedMessage.toString()
            : detailedMessage,
      });
    },
    [setCurrentNotice],
  );

  return {
    showError,
    currentNotice,
    setCurrentNotice,
  };
}

export function NoticesProvider({ children }) {
  const [currentNotice, setCurrentNotice] = useState();
  const noticeData = {
    currentNotice,
    setCurrentNotice,
  };
  return (
    <NoticeContext.Provider value={noticeData}>
      {children}
    </NoticeContext.Provider>
  );
}

export function Notices({ classes }) {
  const { currentNotice, setCurrentNotice } = useNotices();
  const [areDetailsVisible, setDetailsVisible] = useState(false);

  const { type = 'info', message = '', detailedMessage = '' } =
    currentNotice || {};

  const action =
    !areDetailsVisible && detailedMessage ? (
      <Button
        color="inherit"
        size="small"
        onClick={() => setDetailsVisible(true)}>
        details
      </Button>
    ) : null;

  const messageText = areDetailsVisible ? (
    <div>
      <span id="client-snackbar">{message}</span>
      <p>Details: {detailedMessage}</p>
    </div>
  ) : (
    <span id="client-snackbar">{message}</span>
  );

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={!!currentNotice}
        onClose={() => {
          setCurrentNotice();
          setDetailsVisible(false);
        }}>
        <SnackbarContent
          className={`${classes.noticeBox} ${
            type === 'error' ? classes.noticeError : classes.noticeInfo
          }`}
          aria-describedby="client-snackbar"
          message={messageText}
          action={action}
        />
      </Snackbar>
    </div>
  );
}
