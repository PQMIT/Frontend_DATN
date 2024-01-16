import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(3),
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
    paddingRight: theme.spacing(20),
    paddingLeft: theme.spacing(20),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginBottom: theme.spacing(6),
      paddingTop: theme.spacing(10),
      paddingBottom: theme.spacing(10),
      paddingRight: theme.spacing(40),
      paddingLeft: theme.spacing(40),
    },
  },
}));
