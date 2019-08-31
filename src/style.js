/* @format */
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    root: {
      width: '320px',
      padding: '0',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '95vh',
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        width: '100%',
      },
    },
    actionToolbar: {
      [theme.breakpoints.up('md')]: {
        order: 1,
        height: '100%',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        padding: '0.5em 0 0 0',
      },
    },
    actionToolbarButtonIcon: {
      color: theme.palette.primary.main,
    },
    actionToolbarButton: {
      [theme.breakpoints.up('md')]: {
        flex: 0,
      },
    },
    targetListBox: {
      flex: 1.6,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'hidden',
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
      [theme.breakpoints.up('md')]: {
        order: 3,
      },
    },
    targetList: {
      padding: '0',
      overflowY: 'scroll',
      WebkitOverflowScrolling: 'touch',
    },
    sourceListBox: {
      flex: 2,
      overflowY: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.up('md')]: {
        order: 2,
      },
    },
    sourceList: {
      overflowY: 'scroll',
      WebkitOverflowScrolling: 'touch',
    },
    removeButton: {
      color: theme.palette.primary.contrastText,
    },
    targetListItemEmpty: {
      minHeight: '0.5em',
    },
    targetListItemDot: {
      padding: '0.5em',
    },
    sourceListItemButton: {
      color: theme.palette.primary.main,
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
  };
});

export default useStyles;
