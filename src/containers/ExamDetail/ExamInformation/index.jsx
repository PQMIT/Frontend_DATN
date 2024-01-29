/* eslint-disable no-unused-expressions */
/* eslint-disable no-useless-return */
/* eslint-disable consistent-return */
// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { Typography, Box, TextField, Button } from '@material-ui/core';
/* import {
  Description as DescriptionIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@material-ui/icons'; */
import useStyles from './index.style';
import apis from '../../../apis';
import constants from '../../../constants';
import errorCodes from '../../../constants/errorCodes';
import LoadingPage from '../../../components/LoadingPage';

const PrepareExam = ({ examId }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [contest, setContest] = useState();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleRedirectToExamTest = (contestToken) => {
    history.push(`/contest/${examId}/exam/test?token=${contestToken}`);
  };

  const handleCheckPassword = async () => {
    try {
      const data = await apis.contest.verifyPassword({ id: examId, password });
      if (data.status) {
        const { contestToken } = data.result;
        handleRedirectToExamTest(contestToken);
      } else {
        enqueueSnackbar(data.message || 'Check password failed', {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackbar('Check password failed', {
        variant: 'error',
      });
    }
  };

  const fetchContest = async () => {
    const data = await apis.contest.getContest(examId);
    if (data && data.status) {
      const { contest: contestData } = data.result;
      setContest(contestData);
      setIsLoading(false);
    } else {
      enqueueSnackbar((data && data.message) || 'Fetch data failed', {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    fetchContest();
  }, []);

  const renderUpcomingStatus = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Sắp diễn ra
        </Typography>
      </Box>
    );
  };
  const renderHappeningStatus = () => {
    return (
      <Box>
        <Box display="flex" mt={2}>
          {contest.isLock && (
            <TextField
              size="small"
              id="outlined-basic"
              label="Nhập code"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <Button
            style={{ marginLeft: 3 }}
            variant="contained"
            color="primary"
            size="medium"
            onClick={() => {
              contest.isLock
                ? handleCheckPassword()
                : handleRedirectToExamTest();
            }}
          >
            Thi
          </Button>
        </Box>
      </Box>
    );
  };
  const renderEndedStatus = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Đã kết thúc
        </Typography>
      </Box>
    );
  };
  const renderByStatus = () => {
    if (contest) {
      if (contest.status === constants.UPCOMING) return renderUpcomingStatus();
      if (contest.status === constants.HAPPENING)
        return renderHappeningStatus();
      if (contest.status === constants.ENDED) return renderEndedStatus();
    }

    return;
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Box className={classes.paper}>
        <Typography variant="subtitle1" gutterBottom>
          Tên: {contest && contest.title}
        </Typography>
        <Box display="flex">
          <Typography variant="subtitle1" gutterBottom>
            Mô tả: {(contest && contest.description) || ''}
          </Typography>
        </Box>
        <Box display="flex">
          <Typography variant="subtitle1" gutterBottom>
            Thời gian: {contest && contest.examTime}(m)
          </Typography>
        </Box>
        <Box display="flex">
          <Typography variant="subtitle1" gutterBottom>
            <p>
              <strong class="">Nội quy</strong>
            </p>
            <span>
              <p>
                <strong class="text-danger" style={{ color: '#dc3545' }}>
                  - Không nhờ người khác thi hộ. <br />- Không sao chép câu trả
                  lời từ tài liệu trên internet. <br />
                  - Không sử dụng thiết bị khác . <br /> - Không dùng tab khác
                  để hỗ trợ bài thi . <br /> - Không thoát khỏi màn hình trong
                  quá trình làm bài thi.
                  <br />
                  - Không reload lại trang web hay tắt website khi đang làm bài
                  thi.
                  <br />
                  -Nếu vi phạm các điều trên, hệ thống tự động nộp bài và ghi
                  nhận kết quả trước đó
                </strong>
              </p>
            </span>
          </Typography>
        </Box>

        {renderByStatus()}
      </Box>
    </>
  );
};

export default PrepareExam;
