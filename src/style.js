import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles({
  root: {
    width: '320px',
    padding: '0',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '95vh',
  },
  targetListBox: {
    flex: 1.6,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
    backgroundColor: '#6200EE',
    color: '#fff',
  },
  targetList: {
    padding: '0',
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
  },
  sourceListBox: {
    flex: 2,
    overflowY: 'hidden',
  },
  sourceList: {
    height: '70%',
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
  },
  removeButton: {
    color: '#fff',
  },
  targetListItem: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
    backgroundClip: 'padding-box',
  },
  targetListItemEmpty: {
    minHeight: '0.5em',
  },
  sourceListItem: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.14)',
    backgroundClip: 'padding-box',
  },
  sourceListItemHidden: {
    display: 'none',
  },
  itemDetailAppBar: {
    position: 'relative',
  },
  itemDetailTitle: {
    flex: '1',
  },
  totalHeaderTitle: {
    color: '#fff',
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
  },
  PoweredByGoogle: {
    marginTop: '1em',
  },
  addItemButton: {
    fontSize: '2rem',
  },
});

export default useStyles;
