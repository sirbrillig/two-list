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
import { useDistance } from './voyageur-sync';

function getMilesFromMeters(meters) {
  return (meters * 0.000621371192).toFixed(2);
}

export default function TargetList({
  items,
  removeFromTarget,
  clearItems,
  targetListRef,
  classes,
}) {
  const { totalMeters, isLoading } = useDistance(items);
  const totalDistance = getMilesFromMeters(totalMeters);
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
        transform: 'translate3d(-100%,0,0)',
        maxHeight: '50px',
      },
      enter: {
        opacity: 1,
        transform: 'translate3d(0%,0,0)',
        maxHeight: '50px',
      },
      leave: () => async next => {
        await next({ opacity: 0, transform: 'translate3d(50%,0,0)' });
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
        classes={classes}>
        {index < items.length - 1 && (
          <TargetListItemConnector classes={classes} />
        )}
      </TargetListItem>
    </animated.div>
  ));
  return (
    <Paper elevation={0} square={true} className={classes.targetListBox}>
      <TotalHeader
        totalDistance={totalDistance}
        isLoading={isLoading}
        clearItems={clearItems}
        classes={classes}
      />
      <Divider className={classes.targetListHeaderDivider} />
      <List className={classes.targetList} ref={targetListRef}>
        {itemElements}
      </List>
    </Paper>
  );
}

function TargetListItemConnector({ classes }) {
  return <div className={classes.targetListItemConnector}> </div>;
}

function TargetListItem({
  item,
  itemNumber,
  removeFromTarget,
  classes,
  children,
}) {
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
      {children}
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
