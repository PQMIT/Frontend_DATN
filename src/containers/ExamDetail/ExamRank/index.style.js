import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  actionBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    '&:hover': {
      backgroundColor: '#eee',
    },
    cursor: 'pointer',
  },
  active: {
    background: '#f6a61f',
  },
}));
