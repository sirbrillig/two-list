/* @format */
import Container from '@material-ui/core/Container';
import React, { useState, useEffect, useRef } from 'react';
import TargetList from './target-list';
import SourceList from './source-list';
import ItemDetail from './item-detail';
import ActionToolbar from './action-toolbar';
import MainToolbar from './main-toolbar';
import useVoyageurSync from './voyageur-sync';

function useScrollToItem(tripLocations, targetListRef) {
  const prevSavedItems = useRef(tripLocations);
  useEffect(() => {
    if (!targetListRef.current) {
      return;
    }
    if (tripLocations.length <= prevSavedItems.current.length) {
      return;
    }
    prevSavedItems.current = tripLocations;
    targetListRef.current.lastElementChild.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }, [targetListRef, tripLocations]);
}

function useLocalStorageState(initialValue, key) {
  const [state, setState] = useState(initialValue);
  useEffect(() => {
    let storedValue;
    try {
      storedValue = window.localStorage.getItem(key);
      if (storedValue) {
        setState(JSON.parse(storedValue));
      }
    } catch (error) {
      console.log('reading local state failed', error);
      return;
    }
  }, [key]);
  function setAndSaveState(newValue) {
    if (typeof newValue === 'function') {
      newValue = newValue(state);
    }
    try {
      const encodedValue = JSON.stringify(newValue);
      console.log('saving local state', newValue, 'to key', key);
      window.localStorage.setItem(key, encodedValue);
    } catch (error) {
      console.log('saving local state failed', error);
    }
    setState(newValue);
  }
  return [state, setAndSaveState];
}

export default function LoggedIn({ classes, logOut }) {
  const [items, setItems] = useVoyageurSync();

  const [tripLocations, setTripLocations] = useLocalStorageState(
    [],
    'voyageurTripLocations',
  );
  const [itemDetail, showItemDetail] = useState();
  const [isShowingAddItem, setIsShowingAddItem] = useState(false);
  const targetListRef = useRef();
  useScrollToItem(tripLocations, targetListRef);

  const sendToTarget = item => {
    const targetItem = { ...item, targetItemId: uniqueId() };
    setTripLocations(saved => [...saved, targetItem]);
  };
  const removeFromTarget = item =>
    setTripLocations(
      tripLocations.filter(it => it.targetItemId !== item.targetItemId),
    );
  const updateItem = updatedItem => {
    console.log('updating item', updatedItem);
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
  const deleteItem = () => {
    console.log('deleting item', itemDetail);
    setItems(items.filter(item => item.id !== itemDetail.id));
    showItemDetail();
    setIsShowingAddItem(false);
  };
  const clearItems = () => setTripLocations([]);
  const isOverlayVisible = isShowingAddItem || itemDetail;

  return (
    <Container className={classes.loggedInRoot}>
      <MainToolbar classes={classes} logOut={logOut} />
      <TargetList
        items={tripLocations}
        removeFromTarget={removeFromTarget}
        targetListRef={targetListRef}
        classes={classes}
      />
      <SourceList
        items={items}
        sendToTarget={sendToTarget}
        showItemDetail={showItemDetail}
        createNewItem={createNewItem}
        active={!isOverlayVisible}
        classes={classes}
      />
      <ItemDetail
        item={itemDetail}
        onClose={onClose}
        newItem={isShowingAddItem}
        deleteItem={deleteItem}
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
