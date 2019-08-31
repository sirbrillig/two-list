/* @format */
import Container from '@material-ui/core/Container';
import React, { useState, useEffect, useRef } from 'react';
import TargetList from './target-list';
import SourceList from './source-list';
import ItemDetail from './item-detail';
import ActionToolbar from './action-toolbar';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import blue from '@material-ui/core/colors/blue';
import deepPurple from '@material-ui/core/colors/deepPurple';

// This must be imported last to have the styles injected low enough for
// overrides to take place.
import useStyles from './style';

import './app.css';

export default function App() {
  const theme = createMuiTheme({
    palette: { primary: blue, secondary: deepPurple },
  });
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
  const [prevSavedItems, setPrevSavedItems] = useState(savedItems);
  const [itemDetail, showItemDetail] = useState();
  const [isShowingAddItem, setIsShowingAddItem] = useState(false);
  const targetListRef = useRef();
  const sendToTarget = item => {
    const targetItem = { ...item, targetItemId: uniqueId() };
    const newItems = [...savedItems, targetItem];
    setPrevSavedItems(savedItems);
    setSavedItems(newItems);
  };
  useEffect(() => {
    targetListRef.current &&
      savedItems.length > prevSavedItems.length &&
      targetListRef.current.lastElementChild.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
  }, [savedItems, prevSavedItems]);
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

  return (
    <ThemeProvider theme={theme}>
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
          active={!itemDetail}
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
    </ThemeProvider>
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
