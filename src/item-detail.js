import AppBar from '@material-ui/core/AppBar';
import Autosuggest from 'react-autosuggest';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import useStyles from './style';

export default function ItemDetail({ item, onClose }) {
  const classes = useStyles();
  return (
    <Dialog
      open={!!item}
      fullScreen
      onClose={onClose}
      TransitionComponent={SlideTransition}>
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
            {item || ''}
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

function AddressInput({ inputRef = () => {}, ref, ...otherProps }) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
      }}
      {...otherProps}
    />
  );
}

function renderSuggestion(suggestion, { isHighlighted }) {
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
    console.log('search is', input);
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
  const [google, setGoogle] = React.useState();
  const onLoad = () => {
    if (!window.google) {
      alert('no google even after load');
      return;
    }
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
            position.coords.longitude,
          ),
        );
      });
  }, [google]);
  return location;
}

function AddressAutosuggestInput() {
  const classes = useStyles();
  const [value, setValue] = React.useState('');
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
        id: 'item-address',
        label: 'Address',
        value,
        onChange: (event, { newValue }) => setValue(newValue),
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
        suggestion: classes.suggestion,
      }}
    />
  );
}

const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
