/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { Paper, Typography, Box, Grid, Button, Link } from '@material-ui/core';
import { AccessTime as AccessTimeIcon } from '@material-ui/icons';
import useStyles from './index.style';
import apis from '../../apis';
import LoadingPage from '../../components/LoadingPage';
import { isImageUrlCheck } from '../../utils/string';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import './ImageZoom.css'; // Import file CSS
import Cookies from 'js-cookie';
import { id } from 'date-fns/locale';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorIcon from '@material-ui/icons/Error';
import handleImageQuestion from '../../utils/handleImage';

let interval = null;
const alphabet = 'A B C D E F G H I K L M N O P Q R S T V X Y Z';
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const DetailExamResult = () => {
  const classes = useStyles();
  const { id, idresultDetail } = useParams();
  const [idContest, setidContest] = useState(id);
  const [idExam, setidExam] = useState(idresultDetail);
  //   console.log({ idContest, idExam });
  const history = useHistory();
  const query = useQuery();

  const [choice, setchoice] = useState([]);
  const [ansQuestion, setansQuestion] = useState([]);
  const [result, setResult] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [contest, setContest] = useState();
  const [answers, setAnswers] = useState([]);
  const [participant, setparticipant] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [questionSelected, setQuestionSelected] = useState({});
  const [isZoomed, setZoomed] = useState(false);
  const user = Cookies.get('user');
  //   console.log(user);
  //   const handleZoomToggle = () => {
  //     setZoomed(!isZoomed);
  //   };

  const fetchContest = async () => {
    try {
      const data = await apis.contest.getResultByContest(idContest);
      if (data && data.status) {
        //filter data by id result exam
        // Sử dụng filter để lọc các đối tượng có trường id bằng idExam
        const filteredArray = data.result.data.filter(
          (item) => item.id == idExam,
        );
        // Sử dụng filter để lọc các đối tượng câu hỏi đã chọn
        const filteredChoice = filteredArray[0].history.filter((item) => {
          for (let index = 0; index < item.question.answers.length; index++) {
            if (item.question.answers[index].answerId == item.choice) {
              choice.push(item.question.answers[index].content);
              //   return true; // Nếu muốn giữ lại đối tượng thỏa mãn điều kiện
              // Hoặc sử dụng return item.question.answers[index]; nếu bạn muốn giữ lại đối tượng đó
            }
            if (item.question.answers[index].isCorrect) {
              ansQuestion.push(item.question.answers[index].content);
              //   return true; // Nếu muốn giữ lại đối tượng thỏa mãn điều kiện
              // Hoặc sử dụng return item.question.answers[index]; nếu bạn muốn giữ lại đối tượng đó
            }
          }
          //   return false; // Nếu không tìm thấy đối tượng thỏa mãn điều kiện
        });
        console.log(ansQuestion);
        console.log(choice);
        console.log(filteredChoice);
        console.log(filteredArray[0].history);
        setResult(filteredArray[0]);
        setparticipant(filteredArray[0].participant);
        setQuestions(filteredArray[0].history);
        setIsLoading(false);
      } else {
        history.push(`/contest/${id}/exam/detail`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (idContest) {
      fetchContest();
    }
  }, [idContest]);

  return (
    <div>
      {/* <Button
        variant="contained"
        color="primary"
        href={`/contest/${idContest}/exam/detail`}
      >
        Quay Lại
      </Button> */}
      <p></p>
      <Box>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            {participant && (
              <Paper className={classes.questionBox}>
                <Box mb={0.5}>
                  <Typography>Thông tin kết quả bài thi</Typography>
                </Box>
                <Box className={classes.listInfo}>
                  <Box mb={0.5}>
                    <Typography>Họ tên: {participant.name} </Typography>
                  </Box>
                  <Box mb={0.5}>
                    <Typography>Số ĐT: {participant.phoneNumber}</Typography>
                  </Box>
                  <Box mb={0.5}>
                    <Typography>Email: {participant.email}</Typography>
                  </Box>
                  <Box mb={0.5}>
                    <Typography>
                      Bài thi trong: {result.doTime} (phút)
                    </Typography>
                  </Box>
                  <Box mb={0.5}>
                    <Typography>
                      Số câu hỏi của đề: {result.amountQuestion} (Câu)
                    </Typography>
                  </Box>
                  <Box mb={0.5}>
                    <Typography>
                      Số câu đúng: {result.amountCorrectQuestion} (Câu)
                    </Typography>
                  </Box>
                  <Box mb={0.5}>
                    <Typography>
                      Chấm điểm :
                      <strong style={{ color: 'red', fontSize: 'x-large' }}>
                        {(
                          (10 * parseInt(result.amountCorrectQuestion)) /
                          parseInt(result.amountQuestion)
                        ).toFixed(2)}{' '}
                      </strong>
                      (Điểm)
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper className={classes.paper}>
              {choice &&
                questions.map((item, index) => (
                  <Box key={index} p={0.5} m={2}>
                    <Typography gutterBottom style={{ textAlign: 'left' }}>
                      <strong>Câu số {index + 1}: </strong>
                      {item.isCorrect ? (
                        <span>
                          <CheckCircleOutlineIcon
                            style={{ color: 'green', marginBottom: '-5px' }}
                          />
                          <span style={{ color: 'green' }}>
                            <strong>Đúng</strong> --
                          </span>
                        </span>
                      ) : (
                        <span>
                          <ErrorIcon
                            style={{ color: 'red', marginBottom: '-5px' }}
                          />
                          <span style={{ color: 'red' }}>
                            <strong>Sai</strong> --
                          </span>
                        </span>
                      )}{' '}
                      <span>
                        Mức độ: [
                        {item.question.level == 'HARD'
                          ? 'KHÓ'
                          : item.question.level == 'MEDIUM'
                          ? 'TRUNG BÌNH'
                          : 'DỄ'}
                        ]
                      </span>
                    </Typography>
                    <Typography gutterBottom style={{ color: '#ccc' }}>
                      Tiêu đề: {item.question.title}
                    </Typography>
                    <span variant="h6" gutterBottom>
                      {item.question && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: handleImageQuestion(
                              item.question.description,
                            ),
                          }}
                          style={{
                            padding: '5px',
                            margin: '20px',
                            border: '2px solid #ccc',
                            borderRadius: '5px',
                          }}
                        />
                      )}
                    </span>
                    <span
                      variant="h6"
                      gutterBottom
                      style={{ color: 'rgb(0 0 0 / 50%)' }}
                    >
                      <span
                        style={{ textDecoration: 'underline', color: 'blue' }}
                      >
                        Đáp án đã chọn:
                      </span>
                      {choice[index] && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: handleImageQuestion(choice[index]),
                          }}
                        />
                      )}
                    </span>
                    <span
                      variant="h6"
                      gutterBottom
                      style={{ color: 'rgb(0 0 0 / 50%)' }}
                    >
                      <span
                        style={{ textDecoration: 'underline', color: 'green' }}
                      >
                        Đáp án đúng:
                      </span>
                      {ansQuestion[index] && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: handleImageQuestion(ansQuestion[index]),
                          }}
                        />
                      )}
                    </span>
                    <Typography gutterBottom>
                      <strong>Giải thích đáp án:</strong>{' '}
                    </Typography>
                    <span
                      variant="h6"
                      gutterBottom
                      style={{ color: 'rgb(0 0 0 / 50%)' }}
                    >
                      {item.question.explain && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: handleImageQuestion(item.question.explain),
                          }}
                        />
                      )}
                    </span>
                  </Box>
                ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default DetailExamResult;
