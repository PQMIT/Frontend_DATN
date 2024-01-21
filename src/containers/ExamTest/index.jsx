/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Snackbar,
} from '@material-ui/core';
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
import { isImageUrlCheck } from '../../utils/string';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import './ImageZoom.css'; // Import file CSS

let interval = null;
const alphabet = 'A B C D E F G H I K L M N O P Q R S T V X Y Z';
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
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
  const [countWarnming, setcountWarnming] = useState(0);
  const [countWarnmingF12, setcountWarnmingF12] = useState(0);
  const [isMarking, setIsMarking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openAlertF12, setOpenAlertF12] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Giả sử kết nối internet là có sẵn ban đầu
  const [isZoomed, setZoomed] = useState(false);

  const handleZoomToggle = () => {
    setZoomed(!isZoomed);
  };

  const handleClick = () => {
    setOpenAlert(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const handleCloseF12 = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlertF12(false);
  };

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
  // Kiểm tra kết nối internet
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // Một số trình duyệt yêu cầu một chuỗi trống để hiển thị thông báo mặc định
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Chặn rời khỏi trang
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const confirmationMessage = 'Bạn có chắc muốn rời khỏi trang này?';
      console.log(confirmationMessage);
      e.returnValue = confirmationMessage; // Standard for most browsers
      return confirmationMessage; // For some older browsers
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Chặn phím F12
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (countWarnmingF12 >= 2) {
        alert('Bạn đã cố tình vị phạm quá 2 lần, bài thi sẽ bị hủy');
        setIsMarking(true);
        return;
      }
      // Kiểm tra nếu phím F12 được nhấn
      // Chặn sử dụng phím tắt (ví dụ: Ctrl+Shift+I, F12)
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        setcountWarnmingF12(countWarnmingF12 + 1);
        setOpenAlertF12(true);
      }
    };
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    // Lắng nghe sự kiện keydown
    document.addEventListener('keydown', handleKeyDown);

    // Xóa lắng nghe khi component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [countWarnmingF12]);

  const handleClickQuestion = (pos) => (e) => {
    e.preventDefault();
    setQuestionSelected({
      position: pos,
      data: contest.questions[pos],
    });
  };

  //Chặn phím PrintScreen và chụp màn hình
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'PrintScreen' && event.shiftKey && event.metaKey) {
        event.preventDefault();
        // Xử lý hoặc hiển thị thông báo khi người dùng cố gắng chụp ảnh màn hình
        console.log('Chụp ảnh màn hình đã bị chặn!');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const captureScreenshot = async () => {
    try {
      /* const canvas = await html2canvas(document.body);
      // Xử lý ảnh chụp được từ màn hình
      console.log(canvas.toDataURL('image/png')); */
    } catch (error) {
      alert('Lỗi khi chụp màn hình:', error);
    }
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
  // Xử lí dạng ảnh dạng {{image_url}}} cho câu hỏi
  const textString = questionSelected.data.description;
  // const imageUrlRegex = /\{\{(.*?)\}\}/g;
  const imageUrlRegex2 = /\{(.*?)\}/g;
  const replacedString = textString.replace(
    imageUrlRegex2,
    (match, imageUrl) => {
      if (isImageUrlCheck(imageUrl)) {
        return `<img src="${imageUrl}" alt="Hình ảnh test" style="width: auto; height: 350px;"  />`;
      } else {
        return imageUrl;
      }
    },
  );
  // Xử lí dạng ảnh dạng {{image_url}}} cho câu trả lời
  const textString2 = questionSelected.data.answers;
  textString2.forEach((item, index, array) => {
    array[index].content = item.content.replace(
      imageUrlRegex2,
      (match, imageUrl) => {
        if (isImageUrlCheck(imageUrl)) {
          return `<img src="${imageUrl}" alt="Hình ảnh test" style="width: auto; height: 350px;"  />`;
        } else {
          return imageUrl;
        }
      },
    );
  });
  // console.log(textString2);

  // Chống copy paste
  const handleCopyPaste = (e) => {
    e.preventDefault();
    if (countWarnming >= 2) {
      alert('Bạn đã copy-paste quá 2 lần, bài thi sẽ bị hủy');
      setIsMarking(true);
      return;
    }
    if (countWarnming == 1) {
      console.log('Copy-paste is not allowed! lần 2');
      setOpenAlert(true);
      setcountWarnming(countWarnming + 1);
      return;
    }
    console.log('Copy-paste is not allowed! lần 1');
    setcountWarnming(1);
    setOpenAlert(true);
  };

  // // Thực hiện các hành động khác tùy thuộc vào trạng thái của DevTools
  // DisableDevtool(options);
  // console.log(DisableDevtool(options));

  return (
    <div
      className={`${isFullscreen ? classes.fullscreen : ''} prevent_copy_paste`}
      onCopy={handleCopyPaste}
      onPaste={handleCopyPaste}
    >
      {/* <Prompt
        when={!isMarking}
        message={(location) =>
          `Are you sure you want to go to ${location.pathname}`
        }
        
      /> */}
      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="warning">
          Cảnh bảo lần {countWarnming} !!! Không được phép Copy-paste
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openAlertF12}
        autoHideDuration={3000}
        onClose={handleCloseF12}
      >
        <Alert onClose={handleCloseF12} severity="warning">
          Cảnh bảo {countWarnmingF12} !!! Còn cố ý sử dụng F12 thì bài thi sẽ bị
          hủy
        </Alert>
      </Snackbar>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
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
              fontSize: '16px',
            }}
          >
            {renderClockTime(timeDoExam)}
          </Typography>
        </Box>
        <Box display="flex">
          <Box mr={0.5}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              onClick={() => {
                setIsMarking(true);
              }}
              style={{ background: '#f16a73', color: '#fff', fontSize: '16px' }}
            >
              Nộp bài
            </Button>
          </Box>
          <Box mr={0.5}>
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
        <Grid container spacing={1}>
          <Grid item xs={12} md={9}>
            <Paper className={classes.paper}>
              <Box mb={0.5}>
                <Typography gutterBottom style={{ textAlign: 'center' }}>
                  Câu số {questionSelected && questionSelected.position + 1}
                </Typography>
                {/* <ModalImage /> */}
                <Typography gutterBottom style={{ color: '#ccc' }}>
                  {questionSelected &&
                    questionSelected.data &&
                    questionSelected.data.title}
                </Typography>
                <div variant="h6" gutterBottom>
                  {questionSelected && questionSelected.data && (
                    <div dangerouslySetInnerHTML={{ __html: replacedString }} />
                  )}
                </div>
                {/*  <Typography variant="h6" gutterBottom>
                  {questionSelected &&
                    questionSelected.data &&
                    questionSelected.data.description}
                </Typography> */}
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
                        <div
                          dangerouslySetInnerHTML={{
                            __html: el.content,
                          }}
                        />
                      </Box>
                    ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper className={classes.questionBox}>
              <Box mb={0.5}>
                <Typography>Danh sách câu hỏi</Typography>
              </Box>
              <Box className={classes.listQuestionBox}>
                {contest &&
                  contest.questions.map((el, index) => (
                    // console.log(el.description),
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
