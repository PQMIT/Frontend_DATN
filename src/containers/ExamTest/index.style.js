import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    paddingRight: theme.spacing(10),
    paddingLeft: theme.spacing(10),
  },
  questionBox: {
    padding: theme.spacing(5),
  },
  listQuestionBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  questionSquare: {
    border: '1px solid #eee',
    width: '20px',
    height: '20px',
    margin: '2px',
    borderRadius: '50px',
    padding: theme.spacing(2),
  },
  fullscreen: {
    background: '#fafafa',
    zIndex: 99999,
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    overflowX: 'hidden',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    position: 'fixed',
    padding: theme.spacing(8),
  },
  answerRow: {
    cursor: 'pointer',
    '&:hover': {
      background: '#ccc',
    },
  },
}));
