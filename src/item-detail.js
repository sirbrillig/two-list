/* @format */
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import React, { useState, useEffect } from 'react';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Toolbar from '@material-ui/core/Toolbar';
import useKeyCode, { clamp } from './use-key-code';
import { useNotices } from './notices';

import google from './google.png';

export default function ItemDetail({
  item,
  onClose,
  newItem,
  deleteItem,
  isLocationEnabled,
  setLocationEnabled,
  classes,
}) {
  return (
    <Dialog
      open={!!item || newItem}
      fullScreen
      onClose={onClose}
      TransitionComponent={SlideTransition}>
      <ItemDetailContent
        item={item || { label: '', id: '' }}
        onClose={onClose}
        newItem={newItem}
        classes={classes}
        deleteItem={deleteItem}
        isLocationEnabled={isLocationEnabled}
        setLocationEnabled={setLocationEnabled}
      />
    </Dialog>
  );
}

function ItemDetailContent({
  item,
  onClose,
  newItem,
  deleteItem,
  isLocationEnabled,
  setLocationEnabled,
  classes,
}) {
  const { showError } = useNotices();
  const [address, setAddress] = useState(item.address || '');
  const [itemName, setItemName] = useState(item.label);
  const [isShowingDeleteConfirm, setIsShowingDeleteConfirm] = useState(false);
  useEffect(() => {
    setItemName(item.label);
  }, [item]);

  const confirmDelete = () => {
    setIsShowingDeleteConfirm(true);
  };
  const handleCloseDeleteDialog = action => {
    setIsShowingDeleteConfirm(false);
    if (action === 'delete') {
      deleteItem();
    }
  };
  const saveChanges = () => {
    if (!itemName || !address) {
      showError('Both name and address are required');
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
          {newItem ? null : (
            <Button color="inherit" aria-label="delete" onClick={confirmDelete}>
              <DeleteIcon className={classes.itemDetailButtonIcon} />
              delete
            </Button>
          )}
          <Button aria-label="save" color="inherit" onClick={saveChanges}>
            <SaveIcon className={classes.itemDetailButtonIcon} />
            save
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <div>
          <NameField value={itemName} onChange={setItemName} />
        </div>
        <div className={classes.addressFieldContainer}>
          <AddressAutosuggestInput
            value={address}
            onChange={setAddress}
            classes={classes}
            isLocationEnabled={isLocationEnabled}
            setLocationEnabled={setLocationEnabled}
          />
        </div>
        <PoweredByGoogle classes={classes} />
      </DialogContent>
      <ConfirmDeleteDialog
        open={isShowingDeleteConfirm}
        handleClose={handleCloseDeleteDialog}
      />
    </React.Fragment>
  );
}

function ConfirmDeleteDialog({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        {'Are you sure you want to delete this location?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {
            "Deleted locations cannot be restored (you'll have to add it again if you want it back). Deleting a location that's already in your trip will not remove the location from that trip."
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} color="primary">
          Keep it
        </Button>
        <Button onClick={() => handleClose('delete')} color="primary" autoFocus>
          Delete it
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function NameField({ value, onChange }) {
  const [isTouched, setTouched] = useState(false);
  const handleChange = event => {
    setTouched(true);
    onChange(event.target.value);
  };
  return (
    <TextField
      id="item-name"
      label="Name"
      margin="normal"
      fullWidth
      value={value}
      onChange={handleChange}
      error={isTouched && !value}
    />
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
      if (!predictions) {
        return resolve([]);
      }
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
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement(`script`);
      script.type = `text/javascript`;
      const GOOGLE_API_KEY = 'AIzaSyAz7PGr8-sO1qOXibw8Q4aLPjrsRj6ONzs';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      const headScript = document.getElementsByTagName(`script`)[0];
      headScript.parentNode.insertBefore(script, headScript);
      script.addEventListener('load', onLoad);
      return () => script.removeEventListener(`load`, onLoad);
    } else onLoad();
  }, []);
  return google;
}

function useGoogleAutocomplete({ google }) {
  const [service, setService] = useState();
  useEffect(() => {
    console.log('setService');
    google && setService(new google.maps.places.AutocompleteService());
  }, [google]);
  return service;
}

function useCurrentGoogleLocation({ google, enabled }) {
  const [location, setLocation] = useState();
  useEffect(() => {
    let isSubscribed = true;
    google &&
      enabled &&
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
  }, [google, enabled]);
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

function AddressAutosuggestInput({
  value,
  classes,
  onChange,
  isLocationEnabled,
  setLocationEnabled,
}) {
  const debouncedValue = useDebounce(value, 500);
  const [isTouched, setTouched] = useState();
  const google = useGoogleApi();
  const service = useGoogleAutocomplete({ google });
  const location = useCurrentGoogleLocation({
    google,
    enabled: isLocationEnabled,
  });
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
        error={isTouched && !value}
      />
      {suggestions && (
        <SuggestionList
          suggestions={suggestions}
          clearSuggestions={clearSuggestions}
          onChange={onChoose}
          classes={classes}
        />
      )}
      <FormControlLabel
        control={
          <Checkbox
            checked={isLocationEnabled}
            onChange={() => setLocationEnabled(!isLocationEnabled)}
            value="isLocationEnabled"
          />
        }
        label="Use current location to improve autocomplete"
      />
    </React.Fragment>
  );
}

function SuggestionList({ suggestions, onChange, classes }) {
  const [highlighted, setHighlighted] = useState(0);
  const moveDown = useKeyCode(40);
  const moveUp = useKeyCode(38);
  const chooseCurrent = useKeyCode(13);
  if (moveDown) {
    setHighlighted(prev => clamp(prev + 1, 0, suggestions.length - 1));
  }
  if (moveUp) {
    setHighlighted(prev => clamp(prev - 1, 0));
  }
  if (chooseCurrent) {
    console.log('adding current suggestion');
    suggestions[highlighted] && onChange(suggestions[highlighted].label);
  }
  return (
    <Paper square className={classes.suggestionList}>
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
