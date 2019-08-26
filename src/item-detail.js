import AppBar from '@material-ui/core/AppBar';
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

import google from './google.png';

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
        <PoweredByGoogle />
      </DialogContent>
    </Dialog>
  );
}

function PoweredByGoogle() {
  const classes = useStyles();
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

function useAutocompleteValue({ search, service, location }) {
  const [suggestions, setSuggestions] = React.useState([]);
  React.useEffect(() => {
    let isSubscribed = true;
    if (service) {
      getSuggestionsFor({ input: search, service, location }).then(
        suggestions => {
          isSubscribed && setSuggestions(suggestions);
        },
      );
    }
    return () => (isSubscribed = false);
  }, [service, search, location]);
  const clearSuggestions = () => setSuggestions([]);
  return { suggestions, clearSuggestions };
}

function AddressAutosuggestInput() {
  const [value, setValue] = React.useState('');
  const debouncedValue = useDebounce(value, 500);
  const google = useGoogleApi();
  const service = useGoogleAutocomplete({ google });
  const location = useCurrentGoogleLocation({ google });
  const { suggestions, clearSuggestions } = useAutocompleteValue({
    search: debouncedValue,
    service,
    location,
  });
  const onChange = event => {
    setValue(event.target.value);
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
        onChange={onChange}
      />
      {suggestions && (
        <SuggestionList
          suggestions={suggestions}
          clearSuggestions={clearSuggestions}
          onChange={setValue}
        />
      )}
    </React.Fragment>
  );
}

function SuggestionList({ suggestions, onChange }) {
  return (
    <Paper square>
      {suggestions.map(suggestion => (
        <SuggestionItem
          key={suggestion.label}
          text={suggestion.label}
          onChange={onChange}
        />
      ))}
    </Paper>
  );
}

function SuggestionItem({ text, isHighlighted, onChange }) {
  const onClick = () => onChange(text);
  return (
    <MenuItem selected={isHighlighted} component="div" onClick={onClick}>
      {text}
    </MenuItem>
  );
}

const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
