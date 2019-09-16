/* @format */
import { useEffect, useRef } from 'react';

export default function useScrollToItem(items, listRef) {
  const prevSavedItems = useRef(items);
  useEffect(() => {
    if (!listRef.current) {
      console.log('cannot scroll; no ref');
      return;
    }
    if (items.length <= prevSavedItems.current.length) {
      console.log('cannot scroll; no change');
      return;
    }
    prevSavedItems.current = items;
    listRef.current.lastElementChild.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }, [listRef, items]);
}
