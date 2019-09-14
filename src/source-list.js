/* @format */
import React, { useState, useEffect, useRef } from 'react';
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
  shouldShowGuide,
  createNewItem,
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
  const moveDown = useKeyCode(40);
  const moveUp = useKeyCode(38);
  const chooseCurrent = useKeyCode(13);
  if (moveDown) {
    active &&
      setHighlighted(prev => clamp(prev + 1, 0, visibleItems.length - 1));
  }
  if (moveUp) {
    active && setHighlighted(prev => clamp(prev - 1, 0));
  }
  if (chooseCurrent) {
    active && sendToTarget(visibleItems[highlighted]);
  }
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
  const guideElement = (
    <GuideElement key="guide-element" classes={classes} items={items} />
  );
  const addButton = (
    <IconButton
      classes={{ root: classes.sourceListAddButton }}
      color="inherit"
      aria-label="add new place"
      onClick={createNewItem}>
      <Icon fontSize="large">add_circle</Icon>
    </IconButton>
  );
  const itemsWithSearch = shouldShowGuide
    ? [searchItem, ...itemElements, guideElement]
    : [searchItem, ...itemElements];
  return (
    <Card elevation={1} className={classes.sourceListBox}>
      <CardHeader
        classes={{
          content: classes.sourceListHeaderContent,
        }}
        title="Places"
        subheader={addButton}
      />
      <Divider />
      {items.length ? (
        <List className={classes.sourceList}>{itemsWithSearch}</List>
      ) : (
        <EmptyLocationsList classes={classes} />
      )}
    </Card>
  );
}

function GuideElement({ classes, items }) {
  if (items.length === 1) {
    return (
      <div className={classes.guideElement}>
        <div className={classes.guideElementTitle}>Almost there!</div>
        <Icon fontSize="large">thumb_up</Icon>
        <p>Add another place and then you can start finding distances!</p>
      </div>
    );
  }
  return (
    <div className={classes.guideElement}>
      <div className={classes.guideElementTitle}>Start your trip!</div>
      <Icon fontSize="large">thumb_up</Icon>
      <p>Click the icons above to add places to your trip.</p>
    </div>
  );
}

function EmptyLocationsList({ classes }) {
  return (
    <div className={classes.emptyLocationsList}>
      <Icon fontSize="large" className={classes.emptyLocationsListIcon}>
        emoji_transportation
      </Icon>
      <div className={classes.emptyLocationsListTitle}>No places yet!</div>
      <p>Add a place and it will appear here.</p>
    </div>
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
          <Icon fontSize="large">add_box</Icon>
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
  return (
    label.toLowerCase().includes(searchValue.toLowerCase()) ||
    address.toLowerCase().includes(searchValue.toLowerCase())
  );
}
