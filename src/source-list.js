/* @format */
import React, { useState } from 'react';
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
import useStyles from './style';

export default function SourceList({ items, sendToTarget, showItemDetail }) {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const itemElements = items.map(item => (
    <SourceListItem
      item={item}
      key={item.id}
      sendToTarget={sendToTarget}
      showItemDetail={showItemDetail}
      hidden={!doesItemMatchSearch(item, searchValue)}
    />
  ));
  const onSearchChange = event => setSearchValue(event.target.value);
  const searchItem = (
    <SourceListSearch
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

function SourceListItem({ item, sendToTarget, showItemDetail, hidden }) {
  const classes = useStyles();
  const onClick = () => showItemDetail(item);
  return (
    <ListItem
      className={classes.sourceListItem}
      ContainerProps={hidden ? { className: classes.sourceListItemHidden } : {}}
      button
      onClick={onClick}>
      <ListItemText>{item.label}</ListItemText>
      <ListItemSecondaryAction>
        <IconButton
          size="small"
          aria-label="add"
          color="primary"
          onClick={() => sendToTarget(item)}>
          <Icon>add_circle</Icon>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function SourceListSearch({ value, onChange }) {
  return (
    <ListItem>
      <TextField
        id="search"
        label="Search"
        type="search"
        fullWidth
        value={value}
        onChange={onChange}
      />
    </ListItem>
  );
}

function doesItemMatchSearch(item, searchValue) {
  const { label = '', address = '' } = item;
  return label.includes(searchValue) || address.includes(searchValue);
}
