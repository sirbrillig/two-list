/* @format */
import Container from '@material-ui/core/Container';
import React, { useState, useEffect, useRef } from 'react';
import TargetList from './target-list';
import SourceList from './source-list';
import ItemDetail from './item-detail';
import ActionToolbar from './action-toolbar';
import MainToolbar from './main-toolbar';
import {
  listLocations,
  createNewLocation,
  deleteLocationFromLibrary,
} from './voyageur-api';
import { useAuth0 } from './react-auth0-wrapper';
import { useNotices } from './notices';

export default function LoggedIn({ classes, logOut }) {
  const { showError } = useNotices();
  const [items, setItems] = useState([]);
  const [serverItems, setServerItems] = useState([]);
  const { getTokenSilently } = useAuth0();
  useEffect(() => {
    async function getLocations() {
      console.log('fetching items from server');
      const token = await getTokenSilently();
      const locations = await listLocations(token);
      setServerItems(translateRemoteItems(locations));
    }
    getLocations().catch(error => showError(error.toString()));
  }, []); //eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    async function syncItemsToServer() {
      const token = await getTokenSilently();
      const serverItemIds = serverItems.map(item => item.id);
      const itemIds = items.map(item => item.id);
      const itemsNotOnClient = serverItems.filter(
        item => !itemIds.includes(item.id),
      );
      const itemsNotOnServer = items.filter(
        item => !serverItemIds.includes(item.id),
      );
      if (!itemsNotOnServer.length && !itemsNotOnClient.length) {
        return;
      }
      console.log('syncing items with server');
      await Promise.all([
        ...translateItemsToRemote(itemsNotOnServer).map(item =>
          createNewLocation(token, item),
        ),
        ...itemsNotOnClient.map(item => deleteLocationFromLibrary(token, item)),
      ]);
      const locations = await listLocations(token);
      setServerItems(translateRemoteItems(locations));
    }
    syncItemsToServer().catch(error => showError(error.toString()));
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    setItems(serverItems);
  }, [serverItems]);
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
  const deleteItem = () => {
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

function translateRemoteItems(items) {
  return items.map(item => ({
    label: item.name,
    address: item.address,
    id: item._id,
  }));
}

function translateItemsToRemote(items) {
  return items.map(item => ({
    name: item.label,
    address: item.address,
  }));
}
