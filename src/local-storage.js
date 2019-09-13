/* @format */
import { useState, useEffect } from 'react';

export default function useLocalStorageState(initialValue, key) {
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
