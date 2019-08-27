import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(() => ({
  root: {
    width: '320px',
    padding: '0',
    position: 'relative',
  },
  targetListBox: {
    backgroundColor: '#6200EE !important',
    height: '10em',
    overflowY: 'scroll',
    color: '#fff !important',
  },
  targetList: {
    padding: '0',
  },
  sourceListBox: {
    height: '100%',
  },
  sourceList: {
    height: '18em',
    overflowY: 'scroll',
  },
  removeButton: {
    color: '#fff !important',
  },
  targetListItem: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
    backgroundClip: 'padding-box',
  },
  targetListItemEmpty: {
    minHeight: "2em",
  },
  sourceListItem: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.14)',
    backgroundClip: 'padding-box',
  },
  itemDetailAppBar: {
    position: 'relative !important',
  },
  itemDetailTitle: {
    flex: "1 !important",
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
}));

export default useStyles;
