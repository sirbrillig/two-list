/* @format */
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    root: {
      maxWidth: '400px',
      padding: '0',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '95vh',
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        maxWidth: '100%',
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
      overflowX: 'hidden',
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
    targetListHeaderDivider: {
      backgroundColor: theme.palette.primary.contrastText,
    },
    targetListItemEmpty: {
      minHeight: '0.5em',
    },
    targetListItemConnector: {
      position: 'absolute',
      minHeight: '1em',
      borderRight: `1px solid ${theme.palette.primary.contrastText}`,
      left: 0,
      top: '3em',
      paddingLeft: '2.5em',
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
      color: theme.palette.primary.contrastText,
      [theme.breakpoints.up('md')]: {
        position: 'absolute',
        right: '0',
        top: '0.4em',
        margin: '1em',
      },
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
