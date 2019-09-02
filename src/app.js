/* @format */
import Container from '@material-ui/core/Container';
import React, { useState, useEffect, useRef } from 'react';
import TargetList from './target-list';
import SourceList from './source-list';
import ItemDetail from './item-detail';
import ActionToolbar from './action-toolbar';
import MainToolbar from './main-toolbar';
import LoggedOut from './logged-out';
import { NoticesProvider, Notices } from './notices';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import locations from './sample-locations';

// This must be imported last to have the styles injected low enough for
// overrides to take place.
import useStyles from './style';

import './app.css';

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

function App() {
  const classes = useStyles();
  const [isLoggedIn, setLoggedIn] = useState(false);

  const [items, setItems] = useState(locations);
  const [savedItems, setSavedItems] = useState([]);
  const prevSavedItems = useRef(savedItems);
  const [itemDetail, showItemDetail] = useState();
  const [isShowingAddItem, setIsShowingAddItem] = useState(false);
  const targetListRef = useRef();
  const sendToTarget = item => {
    const targetItem = { ...item, targetItemId: uniqueId() };
    setSavedItems(saved => [...saved, targetItem]);
  };
  useEffect(() => {
    if (!targetListRef.current) {
      return;
    }
    if (savedItems.length <= prevSavedItems.current.length) {
      return;
    }
    prevSavedItems.current = savedItems;
    targetListRef.current.lastElementChild.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }, [savedItems]);
  const removeFromTarget = item =>
    setSavedItems(
      savedItems.filter(it => it.targetItemId !== item.targetItemId),
    );
  const updateItem = updatedItem => {
    setItems(
      items.map(it => {
        if (it.id === updatedItem.id) {
          return updatedItem;
        }
        return it;
      }),
    );
  };
  const addNewItem = newItem => {
    newItem.id = uniqueId();
    setItems([...items, newItem]);
  };
  const onClose = ({ updatedItem, newItem }) => {
    showItemDetail();
    setIsShowingAddItem(false);
    updatedItem && updateItem(updatedItem);
    newItem && addNewItem(newItem);
  };
  const createNewItem = () => {
    setIsShowingAddItem(true);
  };
  const clearItems = () => setSavedItems([]);
  const isOverlayVisible = isShowingAddItem || itemDetail;

  if (!isLoggedIn) {
    return <LoggedOut classes={classes} logIn={() => setLoggedIn(true)} />;
  }

  return (
    <Container className={classes.root}>
      <NoticesProvider>
        <MainToolbar classes={classes} logOut={() => setLoggedIn(false)} />
        <TargetList
          items={savedItems}
          removeFromTarget={removeFromTarget}
          targetListRef={targetListRef}
          classes={classes}
        />
        <SourceList
          items={items}
          sendToTarget={sendToTarget}
          showItemDetail={showItemDetail}
          active={!isOverlayVisible}
          classes={classes}
        />
        <ItemDetail
          item={itemDetail}
          onClose={onClose}
          newItem={isShowingAddItem}
          classes={classes}
        />
        <ActionToolbar
          createNewItem={createNewItem}
          clearItems={clearItems}
          classes={classes}
        />
        <Notices classes={classes} />
      </NoticesProvider>
    </Container>
  );
}

function uniqueId() {
  return (
    Date.now() +
    Math.random()
      .toString()
      .slice(2)
  );
}
