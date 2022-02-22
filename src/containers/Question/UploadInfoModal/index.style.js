import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    width: '30%',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[5],
    padding: theme.spacing(5, 4, 5),
    outline: 'none',
    overflow: 'auto',
  },
}));
