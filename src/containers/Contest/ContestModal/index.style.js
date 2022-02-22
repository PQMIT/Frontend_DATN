import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    top: '5%',
    bottom: '5%',
    left: '20%',
    // transform: 'translate(-50%, 0%)',
    position: 'absolute',
    width: '60%',
    backgroundColor: '#fff',
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[5],
    padding: theme.spacing(5, 4, 5),
    outline: 'none',
    overflow: 'auto',
  },
  listAnswer: {
    border: '1px solid #ccc',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(0.5),
    height: '300px',
    overflow: 'auto',
  },
  textCreateAnswer: {
    marginLeft: theme.spacing(0.5),
  },
  listAnswerContent: {
    marginBottom: theme.spacing(1),
  },
  formControl: {
    width: '100%',
  },
  input: {
    display: 'none',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));
