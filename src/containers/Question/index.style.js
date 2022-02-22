import { makeStyles } from '@material-ui/core/styles';
import { COLOR } from '../../styles/color';

export default makeStyles((theme) => ({
  textPrimary: {
    fontSize: theme.spacing(2.5),
    fontWeight: 'bold',
  },
  accordion: {
    padding: theme.spacing(2),
  },
  menusToggle: {
    boxShadow: theme.palette.boxShadow_l1,
  },
  question: {
    fontWeight: 'bold',
  },
  heading: {
    fontSize: theme.spacing(2.5),
  },
  detail: {
    width: '100%',
  },
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
  redStatus: {
    color: COLOR.red['500'],
  },
  greenStatus: { color: COLOR.green['500'] },
  yellowStatus: { color: COLOR.yellow['500'] },
  input: {
    display: 'none',
  },
}));
