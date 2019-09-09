/* @format */
import { useEffect, useReducer } from 'react';
import {
  listLocations,
  createNewLocation,
  deleteLocationFromLibrary,
} from './voyageur-api';
import { useAuth0 } from './react-auth0-wrapper';
import { useNotices } from './notices';

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

function areArraysEmpty(...arrays) {
  return arrays.filter(array => array.length > 0).length === 0;
}

function doArraysDiffer(array1, array2) {
  const diff1 = array1.filter(item => !array2.includes(item));
  const diff2 = array2.filter(item => !array1.includes(item));
  return !areArraysEmpty(diff1, diff2);
}

function voyageurSyncReducer(state, action) {
  console.log('reducer action', action);
  switch (action.type) {
    case 'setItems': {
      return {
        ...state,
        items: action.payload,
      };
    }
    case 'setServerItems': {
      const serverItemIds = action.payload.map(item => item.id);
      const clientItemIds = state.items.map(item => item.id);
      return {
        ...state,
        serverItems: action.payload,
        items: doArraysDiffer(serverItemIds, clientItemIds)
          ? action.payload
          : state.items,
      };
    }
    default:
      return state;
  }
}

async function syncItemsToServer({ getTokenSilently, dispatch, state }) {
  const token = await getTokenSilently();
  const serverItemIds = state.serverItems.map(item => item.id);
  const clientItemIds = state.items.map(item => item.id);
  const itemsToAddToServer = state.items.filter(
    item => !serverItemIds.includes(item.id),
  );
  const itemsToDeleteFromServer = state.serverItems.filter(
    item => !clientItemIds.includes(item.id),
  );
  if (areArraysEmpty(itemsToAddToServer, itemsToDeleteFromServer)) {
    return;
  }
  console.log(
    'syncing items with server; adding',
    itemsToAddToServer,
    'removing',
    itemsToDeleteFromServer,
  );
  await Promise.all([
    ...translateItemsToRemote(itemsToAddToServer).map(item =>
      createNewLocation(token, item),
    ),
    ...itemsToDeleteFromServer.map(item =>
      deleteLocationFromLibrary(token, item),
    ),
  ]);
  const locations = await listLocations(token);
  dispatch({
    type: 'setServerItems',
    payload: translateRemoteItems(locations),
  });
}

async function fetchItemsFromServer({ getTokenSilently, dispatch }) {
  console.log('fetching items from server');
  const token = await getTokenSilently();
  const locations = await listLocations(token);
  dispatch({
    type: 'setServerItems',
    payload: translateRemoteItems(locations),
  });
}

export default function useVoyageurSync() {
  // TODO: handle changes to locations as well
  const [state, dispatch] = useReducer(voyageurSyncReducer, {
    items: [],
    serverItems: [],
  });
  console.log('voyageur sync', state);
  const { showError } = useNotices();
  const { getTokenSilently } = useAuth0();

  const { items } = state;
  const setItems = newItems =>
    dispatch({ type: 'setItems', payload: newItems });

  // Initial fetch
  useEffect(() => {
    fetchItemsFromServer({
      getTokenSilently,
      dispatch,
    }).catch(error => showError(error.toString()));
  }, [getTokenSilently, showError]);

  useEffect(() => {
    syncItemsToServer({
      getTokenSilently,
      dispatch,
      state,
    }).catch(error => showError(error.toString()));
  }, [getTokenSilently, showError, state]);

  return [items, setItems];
}
