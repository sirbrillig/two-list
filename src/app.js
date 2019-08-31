/* @format */
import Container from '@material-ui/core/Container';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import TargetList from './target-list';
import SourceList from './source-list';
import ItemDetail from './item-detail';
import ActionToolbar from './action-toolbar';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

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

  const [items, setItems] = useState([
    { label: 'home', id: 1, address: '40 Church Street, Burlington VT' },
    { label: 'work', id: 2, address: '172 Main Street, Burlington VT' },
    {
      label: 'favorite bar',
      id: 3,
      address: '12 Church Street, Burlington VT',
    },
    { label: 'sushi', id: 4, address: '223 Grain Street, Burlington VT' },
    { label: 'candy', id: 5, address: '192 Silver Street, Burlington VT' },
    { label: 'olive oil', id: 6, address: '22 Summit Street, Burlington VT' },
    {
      label: 'tea and coffee',
      id: 7,
      address: '45 Church Street, Burlington VT',
    },
    {
      label: 'dance hall',
      id: 8,
      address: '20 Charlotte Street, Burlington VT',
    },
    { label: 'ski repair', id: 9, address: '4 Church Street, Burlington VT' },
    {
      label: 'church',
      id: 10,
      address: '1 Church Street, Burlington VT',
    },
  ]);
  const [savedItems, setSavedItems] = useState([
    {
      label: 'home',
      id: 1,
      address: '40 Church Street, Burlington VT',
      targetItemId: '1bc1',
    },
    {
      label: 'work',
      id: 2,
      address: '172 Main Street, Burlington VT',
      targetItemId: '3nas',
    },
    {
      label: 'tea and coffee',
      id: 7,
      address: '45 Church Street, Burlington VT',
      targetItemId: '3na0',
    },
    {
      label: 'home',
      id: 1,
      address: '40 Church Street, Burlington VT',
      targetItemId: '2bc1',
    },
  ]);
  const prevSavedItems = useRef(savedItems);
  const [itemDetail, showItemDetail] = useState();
  const [isShowingAddItem, setIsShowingAddItem] = useState(false);
  const targetListRef = useRef();
  const sendToTarget = useCallback(item => {
    const targetItem = { ...item, targetItemId: uniqueId() };
    setSavedItems(saved => [...saved, targetItem]);
  }, []);
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

  return (
    <Container className={classes.root}>
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
