import Container from "@material-ui/core/Container";
import React from 'react';
import useStyles from './style';
import TargetList from './target-list';
import SourceList from './source-list';
import ItemDetail from './item-detail';

import './app.css';

export default function App() {
  const classes = useStyles();
  const [items] = React.useState([
    "test item 1",
    "test item 2",
    "test item 3",
    "test item 4",
    "test item 5",
    "test item 6",
    "test item 7",
    "test item 8",
    "test item 9",
    "test item 10"
  ]);
  const [savedItems, setSavedItems] = React.useState([
    "original item a",
    "original item b",
    "original item c",
    "original item d",
    "original item e"
  ]);
  const [prevSavedItems, setPrevSavedItems] = React.useState(savedItems);
  const [itemDetail, showItemDetail] = React.useState();
  const targetListRef = React.useRef();
  const sendToTarget = item => {
    const newItems = Array.from(new Set([...savedItems, item]));
    if (newItems.length === savedItems.length) {
      return;
    }
    setPrevSavedItems(savedItems);
    setSavedItems(newItems);
  };
  React.useEffect(() => {
    targetListRef.current &&
      savedItems.length > prevSavedItems.length &&
      targetListRef.current.scrollIntoView({
        block: "end",
        behavior: "smooth"
      });
  }, [savedItems, prevSavedItems]);
  const removeFromTarget = item =>
    setSavedItems(savedItems.filter(it => it !== item));
  return (
    <Container className={classes.root}>
      <TargetList
        items={savedItems}
        removeFromTarget={removeFromTarget}
        targetListRef={targetListRef}
      />
      <SourceList
        items={items}
        sendToTarget={sendToTarget}
        showItemDetail={showItemDetail}
      />
      <ItemDetail item={itemDetail} onClose={() => showItemDetail()} />
    </Container>
  );
}
