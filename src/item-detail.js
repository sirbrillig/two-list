/* @format */
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import React, { useState, useEffect } from 'react';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import useKeyCode, { clamp } from './use-key-code';

import google from './google.png';

export default function ItemDetail({ item, onClose, newItem, classes }) {
  return (
    <Dialog
      open={!!item || newItem}
      fullScreen
      onClose={onClose}
      TransitionComponent={SlideTransition}>
      {item ? (
        <ItemDetailContent
          item={item}
          onClose={onClose}
          newItem={newItem}
          classes={classes}
        />
      ) : (
        <ItemDetailContent
          item={{ label: '', id: '' }}
          onClose={onClose}
          newItem={newItem}
          classes={classes}
        />
      )}
    </Dialog>
  );
}

function ItemDetailContent({ item, onClose, newItem, classes }) {
  const [address, setAddress] = useState(item.address || '');
  const setName = event => setItemName(event.target.value);
  const [itemName, setItemName] = useState(item.label);
  useEffect(() => {
    setItemName(item.label);
  }, [item]);

  const saveChanges = () => {
    if (!itemName) {
      return;
    }
    if (newItem) {
      onClose({ newItem: { label: itemName, address } });
      return;
    }
    onClose({ updatedItem: { ...item, label: itemName, address } });
  };

  return (
    <React.Fragment>
      <AppBar className={classes.itemDetailAppBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close">
            <CloseIcon />
          </IconButton>
          <DialogTitle className={classes.itemDetailTitle}>
            {newItem ? 'Add Location' : 'Edit Location'}
          </DialogTitle>
          <Button color="inherit" onClick={saveChanges}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <div>
          <TextField
            id="item-name"
            label="Name"
            margin="normal"
            fullWidth
            value={itemName}
            onChange={setName}
            error={!itemName}
          />
        </div>
        <div>
          <AddressAutosuggestInput value={address} onChange={setAddress} />
        </div>
        <PoweredByGoogle classes={classes} />
      </DialogContent>
    </React.Fragment>
  );
}

function PoweredByGoogle({ classes }) {
  return (
    <div>
      <img
        src={google}
        className={classes.PoweredByGoogle}
        alt="Powered by Google"
      />
    </div>
  );
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      console.log('setTimeout');
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
    if (!input || input.length < 4) {
      return [];
    }
    console.log('looking for', input);
    const translatePredictions = predictions => {
      console.log('got', predictions);
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
  const [google, setGoogle] = useState();
  const onLoad = () => {
    if (!window.google) {
      alert('no google even after load');
      return;
    }
    console.log('setGoogle');
    setGoogle(window.google);
  };
  React.useEffect(() => {
    if (!window.google) {
      const script = document.createElement(`script`);
      script.type = `text/javascript`;
      const GOOGLE_API_KEY = 'AIzaSyAz7PGr8-sO1qOXibw8Q4aLPjrsRj6ONzs';
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
  const [service, setService] = useState();
  React.useEffect(() => {
    console.log('setService');
    google && setService(new google.maps.places.AutocompleteService());
  }, [google]);
  return service;
}

function useCurrentGoogleLocation({ google }) {
  const [location, setLocation] = useState();
  useEffect(() => {
    let isSubscribed = true;
    google &&
      navigator.geolocation.getCurrentPosition(position => {
        console.log('setLocation');
        isSubscribed &&
          setLocation(
            new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude,
            ),
          );
      });
    return () => (isSubscribed = false);
  }, [google]);
  return location;
}

function useAutocompleteValue({ search, service, location }) {
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    console.log('beginning search for', search);
    if (service && search) {
      getSuggestionsFor({ input: search, service, location }).then(
        suggestions => {
          console.log('I am about to set suggestions');
          setSuggestions(suggestions);
        },
      );
    }
  }, [service, search, location]);
  const clearSuggestions = () => setSuggestions([]);
  return { suggestions, clearSuggestions };
}

function AddressAutosuggestInput({ value, onChange }) {
  const debouncedValue = useDebounce(value, 500);
  const [isTouched, setTouched] = useState();
  const google = useGoogleApi();
  const service = useGoogleAutocomplete({ google });
  const location = useCurrentGoogleLocation({ google });
  const { suggestions, clearSuggestions } = useAutocompleteValue({
    // only search if typing has started
    search: isTouched ? debouncedValue : '',
    service,
    location,
  });
  const onType = event => {
    console.log('onType');
    setTouched(true);
    onChange(event.target.value);
    clearSuggestions();
  };
  const onChoose = value => {
    console.log('onChoose');
    onChange(value);
    setTouched(false);
    clearSuggestions();
  };
  return (
    <React.Fragment>
      <TextField
        id="item-address"
        label="Address"
        margin="normal"
        fullWidth
        value={value}
        onChange={onType}
        autoComplete="off"
      />
      {suggestions && (
        <SuggestionList
          suggestions={suggestions}
          clearSuggestions={clearSuggestions}
          onChange={onChoose}
        />
      )}
    </React.Fragment>
  );
}

function SuggestionList({ suggestions, onChange }) {
  const [highlighted, setHighlighted] = useState(0);
  const moveDown = () =>
    setHighlighted(prev => clamp(prev + 1, 0, suggestions.length - 1));
  const moveUp = () => setHighlighted(prev => clamp(prev - 1, 0));
  const chooseCurrent = React.useCallback(() => {
    console.log('adding current suggestion');
    suggestions[highlighted] && onChange(suggestions[highlighted].label);
  }, [suggestions, highlighted, onChange]);
  useKeyCode(40, moveDown); // down
  useKeyCode(38, moveUp); // up
  useKeyCode(13, chooseCurrent); // enter
  return (
    <Paper square>
      {suggestions.map((suggestion, index) => (
        <SuggestionItem
          key={index}
          suggestion={suggestion}
          onChange={onChange}
          isHighlighted={highlighted === index}
        />
      ))}
    </Paper>
  );
}

function SuggestionItem({ suggestion, isHighlighted, onChange }) {
  const onClick = () => onChange(suggestion.label);
  return (
    <MenuItem selected={isHighlighted} component="div" onClick={onClick}>
      {suggestion.label}
    </MenuItem>
  );
}

const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
