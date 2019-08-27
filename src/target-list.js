import React from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { useTransition, animated } from 'react-spring';
import useStyles from './style';

export default function TargetList({ items, removeFromTarget, targetListRef }) {
  const classes = useStyles();
  // We pad the bottom of the list to get the remove animation to look good
  const fakeItem = { id: 'abcdefghijklmnop', targetItemId: 'abcdefghijklmnop', label: '' };
  const paddedItems = [...items, fakeItem];
  const slideInTransitions = useTransition(paddedItems, item => item.targetItemId, {
    config: { clamp: true, friction: 20 },
    from: { opacity: 0, transform: 'translate3d(100%,0,0)', maxHeight: '50px' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)', maxHeight: '50px' },
    leave: () => async next => {
      await next({ opacity: 0, transform: 'translate3d(-50%,0,0)' });
      await next({ maxHeight: '0em' });
    },
  });

  const itemElements = slideInTransitions.map(({ item, props, key }) => (
    <animated.div key={key} style={props}>
      <TargetListItem
        item={item}
        key={item.targetItemId}
        removeFromTarget={removeFromTarget}
      />
    </animated.div>
  ));
  return (
    <Paper elevation={0} className={classes.targetListBox}>
      <List className={classes.targetList} ref={targetListRef}>
        {itemElements}
      </List>
    </Paper>
  );
}

function TargetListItem({ item, removeFromTarget }) {
  const classes = useStyles();
  if (! item.label) {
    return (
      <ListItem className={classes.targetListItemEmpty}>
        <ListItemText> </ListItemText>
      </ListItem>
      );
  }
  return (
    <ListItem className={classes.targetListItem}>
      <ListItemText>{item.label}</ListItemText>
      <ListItemSecondaryAction>
        <IconButton
          size="small"
          aria-label="remove"
          className={classes.removeButton}
          onClick={() => removeFromTarget(item)}>
          <Icon>remove_circle</Icon>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
    );
}
