/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { Paper, Typography, Box, Grid, Button } from '@material-ui/core';
import {
  Fullscreen as FullscreenIcon,
  Send as SendIcon,
  AccessTime as AccessTimeIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@material-ui/icons';
import useStyles from './index.style';
import apis from '../../apis';
import LoadingPage from '../../components/LoadingPage';
import { renderClockTime } from '../../utils/date';
import useUnsavedChangesWarning from './useUnsavedChangesWarning';

let interval = null;

const alphabet = 'A B C D E F G H I K L M N O P Q R S T V X Y Z';
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ExamTest = () => {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();
  const query = useQuery();
  const { enqueueSnackbar } = useSnackbar();
  const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning(
    'Hiện tại bài thi chưa được lưu, nếu bạn thoát mọi câu trả lời trong lần thi này sẽ bị hủy bỏ',
  );
  const [contest, setContest] = useState();
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [questionSelected, setQuestionSelected] = useState({});
  const [timeDoExam, setTimeDoExam] = useState(0);
  const [isMarking, setIsMarking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleChangeAnswer = (value) => {
    setAnswers({
      ...answers,
      [questionSelected.data.id]: value,
    });
  };

  const handleFullscreen = (e) => {
    e.preventDefault();
    setIsFullscreen((prev) => !prev);
  };

  const handleFinishExam = async () => {
    const examData = {
      doTime: contest.examTime * 60 - timeDoExam,
      contestId: contest.id,
      groupQuestionId: contest.groupQuestion,
      answers,
    };
    const data = await apis.contest.mark({
      ...examData,
    });
    if (data && data.status) {
      const { result } = data.result;
      // eslint-disable-next-line no-alert
      console.log(`mark done ${result.amountCorrectQuestion}`);
      history.push(`/contest/${contest.id}/exam/detail?resultId=${result.id}`);
    } else {
      enqueueSnackbar((data && data.message) || 'Mark failed', {
        variant: 'error',
      });
    }
  };

  const handleStartExam = (examTime) => {
    const startTime = new Date();
    interval = setInterval(() => {
      const now = new Date();
      const timeDo = Math.floor((now - startTime) / 1000);
      if (timeDo < examTime) {
        setTimeDoExam(examTime - timeDo);
      } else {
        setTimeDoExam(0);
        setIsMarking(true);
        clearInterval(interval);
      }
    }, 1000);
  };

  const fetchContest = async () => {
    const token = query.get('token');
    const data = await apis.contest.getQuestions({ id, token });
    if (data && data.status) {
      const { contest: contestData } = data.result;
      setContest(contestData);
      setQuestionSelected({
        position: 0,
        data: contestData.questions[0],
      });
      setTimeDoExam(contestData.examTime * 60);
      handleStartExam(contestData.examTime * 60);
      setIsLoading(false);
    } else {
      history.push(`/contest/${id}/exam/detail`);
    }
  };

  useEffect(() => {
    setDirty();
    fetchContest();
    return () => {
      console.log('clear interval');
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    console.log('load marking');
    if (isMarking) {
      setPristine();
      handleFinishExam();
    }
  }, [isMarking]);

  const handleClickQuestion = (pos) => (e) => {
    e.preventDefault();
    setQuestionSelected({
      position: pos,
      data: contest.questions[pos],
    });
  };

  if (isLoading) {
    return <LoadingPage />;
  }
  if (isMarking) {
    return (
      <Box>
        <Typography variant="h6" style={{ color: '#ccc' }}>
          The system is processing, wait a few second...
        </Typography>
      </Box>
    );
  }
  return (
    <div className={isFullscreen && classes.fullscreen}>
      {/* <Prompt
        when={!isMarking}
        message={(location) =>
          `Are you sure you want to go to ${location.pathname}`
        }
      /> */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center">
          <Box mr={1}>
            <AccessTimeIcon />
          </Box>
          <Typography
            variant="button"
            display="block"
            gutterBottom
            style={{
              fontWeight: 'bold',
              fontSize: '20px',
            }}
          >
            {renderClockTime(timeDoExam)}
          </Typography>
        </Box>
        <Box display="flex">
          <Box mr={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              onClick={() => {
                setIsMarking(true);
              }}
              style={{ background: '#f16a73', color: '#fff' }}
            >
              Nộp bài
            </Button>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={
                isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />
              }
              onClick={handleFullscreen}
            >
              {isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình '}
            </Button>
          </Box>
        </Box>
      </Box>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <Paper className={classes.paper}>
              <Box mb={3}>
                <Typography gutterBottom style={{ textAlign: 'center' }}>
                  Câu số {questionSelected && questionSelected.position + 1}
                </Typography>
                <Typography gutterBottom style={{ color: '#ccc' }}>
                  {questionSelected &&
                    questionSelected.data &&
                    questionSelected.data.title}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {questionSelected &&
                    questionSelected.data &&
                    questionSelected.data.description}
                </Typography>
              </Box>
              <Box>
                {questionSelected &&
                  questionSelected.data &&
                  questionSelected.data.answers
                    .sort((a, b) => a.position - b.position)
                    .map((el, index) => (
                      <Box
                        style={{
                          background: `${
                            answers[questionSelected.data.id] === el.answerId
                              ? '#81d1a2'
                              : '#eceff0'
                          }`,
                          padding: '20px 20px',
                          marginBottom: '10px',
                          borderRadius: '10px',
                          border: '1px solid #ccc',
                        }}
                        className={classes.answerRow}
                        onClick={() => handleChangeAnswer(el.answerId)}
                      >
                        <Typography key={index}>
                          {alphabet.split(' ')[index]}.{` ${el.content}`}
                        </Typography>
                      </Box>
                    ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.questionBox}>
              <Box mb={2}>
                <Typography>Danh sách câu hỏi</Typography>
              </Box>
              <Box className={classes.listQuestionBox}>
                {contest &&
                  contest.questions.map((el, index) => (
                    <Button
                      key={index}
                      className={classes.questionSquare}
                      style={
                        questionSelected && questionSelected.position === index
                          ? {
                              background: '#f6a61f',
                              color: '#fff',
                            }
                          : answers[el.id] && {
                              background: '#eceff0',
                              border: '1px solid #ccc',
                            }
                      }
                      onClick={handleClickQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      {Prompt}
    </div>
  );
};

export default ExamTest;
