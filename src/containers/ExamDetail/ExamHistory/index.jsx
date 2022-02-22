import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  TablePagination,
} from '@material-ui/core';
import apis from '../../../apis';
import useStyles from './index.style';
import { renderClockTime } from '../../../utils/date';

const ExamHistory = ({ examId }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [results, setResults] = useState([]);

  const [pagination, setPagination] = useState({
    count: 100,
    page: 0,
    rowsPerPage: 3,
  });

  const handleChangePage = (event, newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  const fetchResultsByUser = async () => {
    const data = await apis.contest.getResultByUserInContest(examId);
    if (data && data.status) {
      setResults(data.result.data);
      setPagination({
        ...pagination,
        count: data.result.data.length,
      });
    } else {
      enqueueSnackbar((data && data.message) || 'Fetch data failed', {
        variant: 'error',
      });
    }
  };
  useEffect(() => {
    fetchResultsByUser();
  }, []);
  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Lần</TableCell>
              <TableCell align="center">Số câu đúng </TableCell>
              <TableCell align="center">Thời gian(m)</TableCell>
              <TableCell align="center">Ngày</TableCell>
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
                <TableRow key={row.id} className={classes.row}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">
                    {row.amountCorrectQuestion}
                  </TableCell>
                  <TableCell align="center">
                    {renderClockTime(row.doTime)}
                  </TableCell>
                  <TableCell align="center">
                    {moment(row.createdAt).format('L')}
                  </TableCell>
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
    </>
  );
};
export default ExamHistory;
