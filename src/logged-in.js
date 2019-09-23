/* @format */
import Container from '@material-ui/core/Container';
import React, { useState, useEffect, useRef } from 'react';
import TargetList from './target-list';
import SourceList from './source-list';
import ItemDetail from './item-detail';
import MainToolbar from './main-toolbar';
import useVoyageurSync from './voyageur-sync';
import useLocalStorageState from './local-storage';
import useScrollToItem from './scroll-to-item';

export default function LoggedIn({ classes, logOut }) {
  const [items, setItems, isLoading, isError] = useVoyageurSync();

  const [tripLocations, setTripLocations] = useLocalStorageState(
    [],
    'voyageurTripLocations',
  );
  const [itemDetail, showItemDetail] = useState();
  const [isShowingAddItem, setIsShowingAddItem] = useState(false);
  const targetListRef = useRef();
  useScrollToItem(tripLocations, targetListRef);
  const sourceListRef = useRef();
  useScrollToItem(items, sourceListRef); // FIXME: make this work
  const [shouldShowGuide, setShowGuide] = useLocalStorageState(
    true,
    'voyageurSeenGuide',
  );
  useEffect(() => {
    if (tripLocations.length > 1) {
      setShowGuide(false);
    }
  }, [setShowGuide, tripLocations]);
  const [isLocationEnabled, setLocationEnabled] = useLocalStorageState(
    false,
    'voyageurIsLocationEnabled',
  );

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
      <Container className={classes.loggedInMainContainer}>
        <TargetList
          items={tripLocations}
          removeFromTarget={removeFromTarget}
          targetListRef={targetListRef}
          clearItems={clearItems}
          classes={classes}
        />
        <SourceList
          isLoading={isLoading}
          isError={isError}
          items={items}
          sourceListRef={sourceListRef}
          sendToTarget={sendToTarget}
          showItemDetail={showItemDetail}
          shouldShowGuide={shouldShowGuide}
          createNewItem={createNewItem}
          active={!isOverlayVisible}
          classes={classes}
        />
        <ItemDetail
          item={itemDetail}
          onClose={onClose}
          newItem={isShowingAddItem}
          deleteItem={deleteItem}
          isLocationEnabled={isLocationEnabled}
          setLocationEnabled={setLocationEnabled}
          classes={classes}
        />
      </Container>
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
