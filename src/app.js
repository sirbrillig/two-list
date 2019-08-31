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
    { label: 'test item 1', id: 1 },
    { label: 'test item 2', id: 2 },
    { label: 'test item 3', id: 3 },
    { label: 'test item 4', id: 4 },
    { label: 'test item 5', id: 5 },
    { label: 'test item 6', id: 6 },
    { label: 'test item 7', id: 7 },
    { label: 'test item 8', id: 8 },
    { label: 'test item 9', id: 9 },
    { label: 'test item 10', id: 10 },
  ]);
  const [savedItems, setSavedItems] = useState([
    { label: 'original item a', id: 101, targetItemId: 4321 },
    { label: 'original item b', id: 102, targetItemId: 4322 },
    { label: 'original item c', id: 103, targetItemId: 4323 },
    { label: 'original item d', id: 104, targetItemId: 4324 },
    { label: 'original item e', id: 105, targetItemId: 4325 },
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
