/* @format */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from '@material-ui/core/Paper';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import useKeyCode, { clamp } from './use-key-code';

export default function SourceList({
  items,
  sendToTarget,
  showItemDetail,
  active,
  classes,
}) {
  const [searchValue, setSearchValue] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const [visibleItems, setVisibleItems] = useState(items);
  useEffect(() => {
    setVisibleItems(
      items.filter(item => doesItemMatchSearch(item, searchValue)),
    );
  }, [items, searchValue]);
  const moveDown = () => {
    active &&
      setHighlighted(prev => clamp(prev + 1, 0, visibleItems.length - 1));
  };
  const moveUp = () => active && setHighlighted(prev => clamp(prev - 1, 0));
  const chooseCurrent = useCallback(
    () => active && sendToTarget(visibleItems[highlighted]),
    [visibleItems, highlighted, active, sendToTarget],
  );
  useKeyCode(40, moveDown); // down
  useKeyCode(38, moveUp); // up
  useKeyCode(13, chooseCurrent); // enter
  useEffect(() => setHighlighted(0), [visibleItems]);

  const highlightedItem = visibleItems.reduce(
    (found, item, index) => (index === highlighted ? item : found),
    { id: null },
  );

  const itemElements = items.map(item => (
    <SourceListItem
      item={item}
      key={item.id}
      sendToTarget={sendToTarget}
      showItemDetail={showItemDetail}
      hidden={!doesItemMatchSearch(item, searchValue)}
      highlighted={highlightedItem.id === item.id}
      classes={classes}
    />
  ));
  const onSearchChange = event => setSearchValue(event.target.value);
  const searchItem = (
    <SourceListSearch
      classes={classes}
      onChange={onSearchChange}
      value={searchValue}
      key="search-element"
    />
  );
  const itemsWithSearch = [searchItem, ...itemElements];
  return (
    <Card elevation={1} className={classes.sourceListBox}>
      <CardHeader title="Items" />
      <Divider />
      <List className={classes.sourceList}>{itemsWithSearch}</List>
    </Card>
  );
}

function SourceListItem({
  item,
  sendToTarget,
  showItemDetail,
  hidden,
  highlighted,
  classes,
}) {
  const onClick = () => showItemDetail(item);
  const ref = useRef();

  useEffect(() => {
    highlighted &&
      ref.current &&
      ref.current.scrollIntoView({
        block: 'end',
        behavior: 'smooth',
      });
  }, [highlighted]);

  return (
    <ListItem
      className={classes.sourceListItem}
      ContainerProps={hidden ? { className: classes.sourceListItemHidden } : {}}
      button
      selected={highlighted}
      onClick={onClick}
      ref={ref}>
      <ListItemText primary={item.label} secondary={item.address} />
      <ListItemSecondaryAction>
        <IconButton
          size="small"
          aria-label="add"
          className={classes.sourceListItemButton}
          onClick={() => sendToTarget(item)}>
          <Icon fontSize="large">add_circle</Icon>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function SourceListSearch({ value, onChange, classes }) {
  const label = (
    <>
      <Icon fontSize="small" className={classes.searchIcon}>
        search
      </Icon>
      Search
    </>
  );
  return (
    <ListItem>
      <TextField
        id="search"
        label={label}
        type="search"
        fullWidth
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
    </ListItem>
  );
}

function doesItemMatchSearch(item, searchValue) {
  const { label = '', address = '' } = item;
  return label.includes(searchValue) || address.includes(searchValue);
}
