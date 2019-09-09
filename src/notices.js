/* @format */
import React, { useState, useCallback, useContext, createContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const NoticeContext = createContext({ currentNotice: null });

export function useNotices() {
  const { currentNotice, setCurrentNotice } = useContext(NoticeContext);

  const showError = useCallback(
    message => {
      console.log('Error!', message);
      setCurrentNotice({
        type: 'error',
        message: message.toString ? message.toString() : message,
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

  const { type = 'info', message = '' } = currentNotice || {};

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={!!currentNotice}
        onClose={() => setCurrentNotice()}>
        <SnackbarContent
          className={`${classes.noticeBox} ${
            type === 'error' ? classes.noticeError : classes.noticeInfo
          }`}
          aria-describedby="client-snackbar"
          message={<span id="client-snackbar">{message}</span>}
        />
      </Snackbar>
    </div>
  );
}
