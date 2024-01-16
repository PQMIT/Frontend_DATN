import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import {
  Box,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  Paper,
  TableBody,
  Avatar,
  TablePagination,
  Button,
  Typography,
} from '@material-ui/core';
import Highcharts from 'highcharts';
import useStyles from './index.style';
import apis from '../../../apis';
import LoadingPage from '../../../components/LoadingPage';
import { renderClockTime } from '../../../utils/date';

const ExamDetail = ({ examId, role, resultId }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfQuestion, setNumberOfQuestion] = useState(0);
  const [pagination, setPagination] = useState({
    count: 100,
    page: 0,
    rowsPerPage: 5,
  });

  const handleChangePage = (event, newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  const renderArrayFromNumberQuestion = () => {
    const arr = [];

    if (results.length > 0) {
      const firstEle = results[0];
      // eslint-disable-next-line operator-assignment
      for (let i = 0; i <= firstEle.amountQuestion; i = i + 1) arr.push(0);
    }
    console.log(arr);
    return [...arr];
  };

  const renderDataChart = () => {
    const arr = renderArrayFromNumberQuestion(numberOfQuestion);
    results.forEach((el) => {
      // eslint-disable-next-line no-plusplus
      arr[el.amountCorrectQuestion]++;
    });
    console.log({ arr });
    return arr;
  };

  const highChartsRender = () => {
    Highcharts.chart({
      chart: {
        type: ['column'],
        renderTo: 'graph-summary-contest',
      },
      title: {
        text: 'Thống kê kết quả',
      },
      xAxis: {
        title: {
          text: 'Số câu đúng',
        },
        categories: renderArrayFromNumberQuestion().map((el, index) => index),
      },
      yAxis: {
        title: {
          text: 'Số người',
        },
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        borderWidth: 0,
        itemDistance: 30,
        margin: 5,
        display: 'none',
      },
      series: [
        {
          name: 'Số người',
          data: renderDataChart(),
          color: '#f6a61f',
        },
      ],
    });
  };

  const fetchResults = async () => {
    const data = await apis.contest.getResultByContest(examId);
    if (data && data.status) {
      const { result } = data;

      const resultIndex = result.data.findIndex((el) => el.id === resultId);
      let page = 0;
      if (resultIndex >= 0) {
        page = Math.floor(resultIndex / pagination.rowsPerPage);
      }
      setResults(result.data);
      setPagination({
        ...pagination,
        count: result.data.length,
        page,
      });
      setIsLoading(false);
    } else {
      enqueueSnackbar((data && data.message) || 'Fetch data failed', {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      highChartsRender();
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Box>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">No.</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell align="center">Số câu đúng</TableCell>
                <TableCell align="center">Thời gian(m)</TableCell>
                <TableCell align="center">Ngày</TableCell>
                {role && <TableCell />}
              </TableRow>
            </TableHead>

            <TableBody>
              {results
                .slice(
                  pagination.page * pagination.rowsPerPage,
                  pagination.page * pagination.rowsPerPage +
                    pagination.rowsPerPage,
                )
                .map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={classes.row}
                    classes={{
                      root: row.id === resultId && classes.active,
                    }}
                  >
                    <TableCell align="center">
                      {pagination.page * pagination.rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Avatar
                          alt="avatar"
                          src={row.participant.avatar}
                          style={{
                            height: '25px',
                            width: '25px',
                            marginRight: '3px',
                          }}
                        />
                        {row.participant.name}
                      </Box>
                      <Box>{row.participant.email}</Box>
                    </TableCell>
                    <TableCell align="center">
                      {row.amountCorrectQuestion}
                    </TableCell>
                    <TableCell align="center">
                      {renderClockTime(row.doTime)}
                    </TableCell>
                    <TableCell align="center">
                      {moment(row.createdAt).format('LLL')}
                    </TableCell>
                    {role && (
                      <TableCell align="center">
                        <Button variant="outlined" color="primary">
                          Chi tiết
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {results.length <= 0 && (
            <Typography
              style={{
                width: '100%',
                padding: 10,
                textAlign: 'center',
                color: '#ccc',
              }}
            >
              Không có dữ liệu
            </Typography>
          )}
        </TableContainer>
        {results.length > pagination.rowsPerPage && (
          <TablePagination
            component="div"
            rowsPerPageOptions={[pagination.rowsPerPage]}
            count={pagination.count}
            page={pagination.page}
            onChangePage={handleChangePage}
            rowsPerPage={pagination.rowsPerPage}
          />
        )}
      </Box>
      <Box mt={2}>
        <Typography variant="h6" gutterBottom>
          Biều đồ
        </Typography>
        <div id="graph-summary-contest" />
      </Box>
    </>
  );
};
export default ExamDetail;
