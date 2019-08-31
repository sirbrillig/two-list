/* @format */
import React from 'react';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Icon from '@material-ui/core/Icon';
import StepIcon from '@material-ui/core/StepIcon';
import IconButton from '@material-ui/core/IconButton';
import { useTransition, animated } from 'react-spring';
import TotalHeader from './total-header';

export default function TargetList({
  items,
  removeFromTarget,
  targetListRef,
  classes,
}) {
  // We pad the bottom of the list to get the remove animation to look good
  const fakeItem = {
    id: 'abcdefghijklmnop',
    targetItemId: 'abcdefghijklmnop',
    label: '',
  };
  const paddedItems = [...items, fakeItem];
  const slideInTransitions = useTransition(
    paddedItems,
    item => item.targetItemId,
    {
      config: { clamp: true, friction: 20 },
      from: {
        opacity: 0,
        transform: 'translate3d(100%,0,0)',
        maxHeight: '50px',
      },
      enter: {
        opacity: 1,
        transform: 'translate3d(0%,0,0)',
        maxHeight: '50px',
      },
      leave: () => async next => {
        await next({ opacity: 0, transform: 'translate3d(-50%,0,0)' });
        await next({ maxHeight: '0em' });
      },
    },
  );

  const itemElements = slideInTransitions.map(({ item, props, key }, index) => (
    <animated.div key={key} style={props}>
      <TargetListItem
        item={item}
        itemNumber={index}
        key={item.targetItemId}
        removeFromTarget={removeFromTarget}
        classes={classes}
      />
    </animated.div>
  ));
  const totalDistance = items.length ? 7 * items.length : 0;
  return (
    <Paper elevation={0} className={classes.targetListBox}>
      <TotalHeader totalDistance={totalDistance} classes={classes} />
      <Divider />
      <List className={classes.targetList} ref={targetListRef}>
        {itemElements}
      </List>
    </Paper>
  );
}

function TargetListItem({ item, itemNumber, removeFromTarget, classes }) {
  if (!item.label) {
    return (
      <ListItem className={classes.targetListItemEmpty}>
        <ListItemText> </ListItemText>
      </ListItem>
    );
  }
  return (
    <ListItem className={classes.targetListItem}>
      <StepIcon
        classes={{ root: classes.targetListItemDot }}
        icon={itemNumber + 1}
      />
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
