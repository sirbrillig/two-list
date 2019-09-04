/* @format */
import Container from '@material-ui/core/Container';
import React, { useState, useEffect, useRef } from 'react';
import TargetList from './target-list';
import SourceList from './source-list';
import ItemDetail from './item-detail';
import ActionToolbar from './action-toolbar';
import MainToolbar from './main-toolbar';
import { listLocations } from './voyageur-api';
import { useAuth0 } from './react-auth0-wrapper';
import { useNotices } from './notices';

export default function LoggedIn({ classes, logOut }) {
  const { showError } = useNotices();
  const [items, setItems] = useState([]);
  const { getTokenSilently } = useAuth0();
  useEffect(() => {
    async function getLocations() {
      const token = await getTokenSilently();
      console.log('got token', token);
      const locations = await listLocations(token);
      console.log('locations are', locations);
      setItems(translateRemoteItems(locations));
    }
    getLocations().catch(error => {
      console.log('failed to get locations', error);
      showError(error.toString());
    });
  }, []); //eslint-disable-line react-hooks/exhaustive-deps
  const [tripLocations, setTripLocations] = useState([]);
  const prevSavedItems = useRef(tripLocations);
  const [itemDetail, showItemDetail] = useState();
  const [isShowingAddItem, setIsShowingAddItem] = useState(false);
  const targetListRef = useRef();
  const sendToTarget = item => {
    const targetItem = { ...item, targetItemId: uniqueId() };
    setTripLocations(saved => [...saved, targetItem]);
  };
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
  }, [tripLocations]);
  const removeFromTarget = item =>
    setTripLocations(
      tripLocations.filter(it => it.targetItemId !== item.targetItemId),
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
  const clearItems = () => setTripLocations([]);
  const isOverlayVisible = isShowingAddItem || itemDetail;

  return (
    <Container className={classes.root}>
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

function translateRemoteItems(items) {
  return items.map(item => ({
    label: item.name,
    address: item.address,
    id: item._id,
  }));
}
