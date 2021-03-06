/* @format */
import { useState, useEffect, useReducer } from 'react';
import {
  listLocations,
  createNewLocation,
  deleteLocationFromLibrary,
  updateLocationParams,
  getDistanceBetween,
} from './voyageur-api';
import { useAuth0 } from './react-auth0-wrapper';
import { useNotices } from './notices';

export default function useVoyageurSync() {
  const [state, dispatch] = useReducer(voyageurSyncReducer, {
    items: [],
    serverItems: [],
    serverItemsLoading: false,
    serverItemsError: false,
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
    }).catch(error => {
      dispatch({ type: 'errorLoading' });
      showError(
        "I'm having trouble connecting to the server. Try reloading the page.",
        error,
      );
    });
  }, [getTokenSilently, showError]);

  useEffect(() => {
    syncItemsToServer({
      getTokenSilently,
      dispatch,
      state,
    }).catch(error => {
      dispatch({ type: 'errorLoading' });
      showError(
        "I'm having trouble connecting to the server. Try reloading the page.",
        error,
      );
    });
  }, [getTokenSilently, showError, state]);

  return [items, setItems, state.serverItemsLoading, state.serverItemsError];
}

export function useDistance(locations) {
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { showError } = useNotices();
  const { getTokenSilently } = useAuth0();
  const [totalMeters, setTotalMeters] = useState(0);
  console.log('getting distance', locations);

  useEffect(() => {
    async function getDistances() {
      setLoading(true);
      console.log('fetching distance', locations);
      const token = await getTokenSilently();
      const distances = await Promise.all(
        getAddressPairs(locations).map(({ start, dest }) => {
          return getDistanceBetween(token, start, dest);
        }),
      );
      console.log('distances calculated');
      setTotalMeters(
        distances.reduce((total, distance) => total + distance, 0),
      );
      setLoading(false);
      setIsError(false);
    }

    getDistances().catch(error => {
      showError(
        "I'm having trouble connecting to the server. Try reloading the page.",
        error,
      );
      setIsError(true);
    });
  }, [getTokenSilently, showError, locations]);

  return { totalMeters, isLoading, isError };
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

function translateItemToRemote(item) {
  return {
    name: item.label,
    address: item.address,
  };
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
    case 'loadingItems':
      return { ...state, serverItemsLoading: true };
    case 'errorLoading':
      return { ...state, serverItemsLoading: false, serverItemsError: true };
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
        serverItemsLoading: false,
        serverItemsError: false,
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
  const itemsToReplaceOnServer = state.items.filter(clientItem => {
    const matchingItem = state.serverItems.find(
      serverItem => clientItem.id === serverItem.id,
    );
    if (!matchingItem) {
      return false;
    }
    return (
      matchingItem.address !== clientItem.address ||
      matchingItem.label !== clientItem.label
    );
  });
  if (
    areArraysEmpty(
      itemsToAddToServer,
      itemsToDeleteFromServer,
      itemsToReplaceOnServer,
    )
  ) {
    console.log('no changes to sync');
    return;
  }
  console.log(
    'syncing items with server; adding',
    itemsToAddToServer,
    'removing',
    itemsToDeleteFromServer,
    'changing',
    itemsToReplaceOnServer,
  );
  await Promise.all([
    ...translateItemsToRemote(itemsToAddToServer).map(item =>
      createNewLocation(token, item),
    ),
    ...itemsToDeleteFromServer.map(item =>
      deleteLocationFromLibrary(token, item),
    ),
    ...itemsToReplaceOnServer.map(item =>
      updateLocationParams(token, item, translateItemToRemote(item)),
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
  dispatch({ type: 'loadingItems' });
  const token = await getTokenSilently();
  const locations = await listLocations(token);
  dispatch({
    type: 'setServerItems',
    payload: translateRemoteItems(locations),
  });
}

function getAddressPairs(locations) {
  let prevLocation = null;
  return locations.reduce((pairs, location) => {
    if (prevLocation) {
      pairs.push({ start: prevLocation.address, dest: location.address });
    }
    prevLocation = location;
    return pairs;
  }, []);
}
