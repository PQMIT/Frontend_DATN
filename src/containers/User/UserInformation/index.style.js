import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  paper: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(6),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginBottom: theme.spacing(6),
      padding: theme.spacing(10),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  paperImage: {
    padding: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
  avatar: {
    position: 'relative',
    borderRadius: '50%',

    '&:hover': {
      '& label': {
        opacity: '0.3',
      },
    },
    overflow: 'hidden',
  },
  btnCamera: {
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    fontSize: '20px',
    backgroundColor: '#FFF',
    opacity: '0',
    transition: '0.5s',
  },
}));
