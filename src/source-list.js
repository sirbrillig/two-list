import React from "react";
import Card from "@material-ui/core/Paper";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import useStyles from './style';

export default function SourceList({ items, sendToTarget, showItemDetail }) {
  const classes = useStyles();
  const itemElements = items.map(item => (
    <SourceListItem
      item={item}
      key={item}
      sendToTarget={sendToTarget}
      showItemDetail={showItemDetail}
    />
  ));
  return (
    <Card elevation={1} className={classes.sourceListBox}>
      <CardHeader title="Items" />
      <Divider />
      <List className={classes.sourceList}>{itemElements}</List>
    </Card>
  );
}

function SourceListItem({ item, sendToTarget, showItemDetail }) {
  const classes = useStyles();
  const onClick = () => showItemDetail(item);
  return (
    <ListItem className={classes.sourceListItem} button onClick={onClick}>
      <ListItemText>{item}</ListItemText>
      <ListItemSecondaryAction>
        <IconButton
          size="small"
          aria-label="add"
          color="primary"
          onClick={() => sendToTarget(item)}
        >
          <Icon>add_circle</Icon>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
