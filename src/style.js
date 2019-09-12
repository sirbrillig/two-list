/* @format */
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    loggedInRoot: {
      maxWidth: '400px',
      backgroundColor: theme.palette.primary.dark,
      padding: '0',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        maxWidth: '100%',
      },
    },
    mainToolbar: {
      backgroundColor: theme.palette.primary.main,
      [theme.breakpoints.up('md')]: {
        width: 'auto',
      },
    },
    mainToolbarToolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      [theme.breakpoints.up('md')]: {
        padding: 0,
      },
    },
    mainToolbarTitle: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    actionToolbar: {
      height: 'auto',
      zIndex: 2,
      boxShadow: theme.shadows[2],
      [theme.breakpoints.up('md')]: {
        order: 1,
        height: '100vh',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        padding: '0.5em 0 0 0',
        boxSizing: 'border-box',
      },
    },
    actionToolbarButtonIcon: {
      color: theme.palette.secondary.main,
    },
    actionToolbarButton: {
      [theme.breakpoints.up('md')]: {
        flex: 0,
      },
    },
    targetListBox: {
      flex: 1.3,
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
      flex: 2.3,
      overflowY: 'hidden',
      display: 'flex',
      position: 'relative',
      flexDirection: 'column',
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
      [theme.breakpoints.up('md')]: {
        order: 2,
        borderBottomRightRadius: theme.shape.borderRadius,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
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
      color: theme.palette.primary.dark,
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
    totalHeaderDistance: {
      color: theme.palette.primary.contrastText,
      fontSize: '1.4em',
    },
    totalHeaderContent: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    totalHeaderIcon: {
      verticalAlign: 'bottom',
      marginLeft: '5px',
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
    loggedOutLogo: {
      display: 'inline',
      width: '3em',
      height: '3em',
      padding: '16px',
    },
    topLogo: {
      display: 'inline',
      width: '3em',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    bottomLogo: {
      margin: 'auto 0.5em 0.5em 0.5em',
      padding: '0.5em',
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'inline',
        width: '4em',
        order: 4,
      },
    },
    actionToolbarAdd: {
      order: 1,
    },
    actionToolbarClear: {
      order: 3,
    },
    searchIcon: {
      verticalAlign: 'sub',
      marginRight: '2px',
    },
    loggedOutRoot: {
      backgroundColor: theme.palette.primary.dark,
      padding: '0',
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100vh',
      maxWidth: '100%',
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
      },
    },
    loggedOut: {
      minWidth: '300px',
      boxSizing: 'border-box',
      padding: '0 1em 1.5em 1em',
      [theme.breakpoints.up('md')]: {
        minWidth: '400px',
      },
    },
    loggedOutHeader: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    noticeBox: {
      [theme.breakpoints.up('sm')]: {
        minWidth: 'auto',
      },
    },
    noticeError: {
      backgroundColor: theme.palette.error.dark,
    },
    noticeInfo: {
      backgroundColor: theme.palette.primary.main,
    },
    loggedOutError: {
      padding: '16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loading: {
      padding: '16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyLocationsList: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      flexDirection: 'column',
    },
    EmptyLocationsListTitle: {
      fontWeight: 'bold',
    },
    emptyLocationsListIcon: {
      fontSize: '6rem',
      [theme.breakpoints.up('md')]: {
        fontSize: '14rem',
      },
    },
    addPlaceFab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  };
});

export default useStyles;
