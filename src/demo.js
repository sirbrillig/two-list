import React from "react";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import Dialog from "@material-ui/core/Dialog";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import DialogTitle from "@material-ui/core/DialogTitle";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Toolbar from "@material-ui/core/Toolbar";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/styles";
import { useTransition, animated } from "react-spring";
import Autosuggest from "react-autosuggest";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#6200EE",
    width: "320px",
    padding: "0",
    position: "relative"
  },
  targetListBox: {
    height: "10em",
    overflowY: "scroll",
    backgroundColor: "#6200EE",
    color: "#fff"
  },
  targetList: {
    padding: "0"
  },
  sourceListBox: {
    height: "100%"
  },
  sourceList: {
    height: "18em",
    overflowY: "scroll"
  },
  removeButton: {
    color: "#fff"
  },
  targetListItem: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.4)",
    backgroundClip: "padding-box"
  },
  sourceListItem: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.14)",
    backgroundClip: "padding-box"
  },
  itemDetailAppBar: {
    position: "relative"
  },
  itemDetailTitle: {
    flex: 1
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  container: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    left: 0,
    right: 0
  }
}));

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

const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ItemDetail({ item, onClose }) {
  const classes = useStyles();
  return (
    <Dialog
      open={!!item}
      fullScreen
      onClose={onClose}
      TransitionComponent={SlideTransition}
    >
      <AppBar className={classes.itemDetailAppBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <DialogTitle className={classes.itemDetailTitle}>
            {item || ""}
          </DialogTitle>
          <Button color="inherit" onClick={onClose}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <div>
          <TextField id="item-name" label="Name" margin="normal" fullWidth />
        </div>
        <div>
          <AddressAutosuggestInput />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddressInput({ classes, inputRef = () => {}, ref, ...otherProps }) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        }
      }}
      {...otherProps}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  return (
    <MenuItem selected={isHighlighted} component="div">
      {suggestion.label}
    </MenuItem>
  );
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

function getSuggestionsFor({ service, input, location }) {
  return new Promise(resolve => {
    console.log("search is", input);
    if (!input || input.length < 4) {
      return [];
    }
    console.log("looking for", input);
    const translatePredictions = predictions => {
      console.log("got", predictions);
      resolve(predictions.map(({ description }) => ({ label: description })));
    };
    const queryOptions = { input };
    if (location) {
      queryOptions.location = location;
      queryOptions.radius = 1000;
    }
    service.getQueryPredictions(queryOptions, translatePredictions);
  });
}

function useGoogleApi() {
  const [google, setGoogle] = React.useState();
  const onLoad = () => {
    if (!window.google) {
      alert("no google even after load");
      return;
    }
    setGoogle(window.google);
  };
  React.useEffect(() => {
    if (!window.google) {
      const script = document.createElement(`script`);
      script.type = `text/javascript`;
      const GOOGLE_API_KEY = "AIzaSyAz7PGr8-sO1qOXibw8Q4aLPjrsRj6ONzs";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      const headScript = document.getElementsByTagName(`script`)[0];
      headScript.parentNode.insertBefore(script, headScript);
      script.addEventListener(`load`, onLoad);
      return () => script.removeEventListener(`load`, onLoad);
    } else onLoad();
  }, []);
  return google;
}

function useGoogleAutocomplete({ google }) {
  const [service, setService] = React.useState();
  React.useEffect(() => {
    google && setService(new google.maps.places.AutocompleteService());
  }, [google]);
  return service;
}

function useCurrentGoogleLocation({ google }) {
  const [location, setLocation] = React.useState();
  React.useEffect(() => {
    google &&
      navigator.geolocation.getCurrentPosition(function(position) {
        setLocation(
          new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          )
        );
      });
  }, [google]);
  return location;
}

function AddressAutosuggestInput() {
  const classes = useStyles();
  const [value, setValue] = React.useState("");
  const debouncedValue = useDebounce(value, 500);
  const [suggestions, setSuggestions] = React.useState([]);
  const google = useGoogleApi();
  const service = useGoogleAutocomplete({ google });
  const location = useCurrentGoogleLocation({ google });
  const fetchSuggestions = async input => {
    if (service) {
      setSuggestions(await getSuggestionsFor({ input, service, location }));
    }
  };
  const clearSuggestions = () => setSuggestions([]);
  const getSuggestionValue = val => val.label;
  return (
    <Autosuggest
      renderInputComponent={AddressInput}
      suggestions={suggestions}
      onSuggestionsFetchRequested={() => fetchSuggestions(debouncedValue)}
      onSuggestionsClearRequested={clearSuggestions}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={{
        id: "item-address",
        label: "Address",
        value,
        onChange: (event, { newValue }) => setValue(newValue)
      }}
      renderSuggestionsContainer={options => (
        <Paper {...options.containerProps} square>
          {options.children}
        </Paper>
      )}
      theme={{
        container: classes.container,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion
      }}
    />
  );
}

function SourceList({ items, sendToTarget, showItemDetail }) {
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

function TargetList({ items, removeFromTarget, targetListRef }) {
  const classes = useStyles();
  const slideInTransitions = useTransition(items, item => item, {
    config: { clamp: true, friction: 20 },
    from: { opacity: 0, transform: "translate3d(100%,0,0)", maxHeight: "50px" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)", maxHeight: "50px" },
    leave: () => async next => {
      await next({ opacity: 0, transform: "translate3d(-50%,0,0)" });
      await next({ maxHeight: "0em" });
    }
  });

  const itemElements = slideInTransitions.map(({ item, props, key }) => (
    <animated.div key={key} style={props}>
      <TargetListItem
        item={item}
        key={item}
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
  return (
    <ListItem className={classes.targetListItem}>
      <ListItemText>{item}</ListItemText>
      <ListItemSecondaryAction>
        <IconButton
          size="small"
          aria-label="remove"
          className={classes.removeButton}
          onClick={() => removeFromTarget(item)}
        >
          <Icon>remove_circle</Icon>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
