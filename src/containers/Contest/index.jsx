/* eslint-disable radix */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import moment from 'moment';
import {
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  TablePagination,
  Checkbox,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
} from '@material-ui/icons';
import SearchBox from '../../components/SearchBox';
import ContestModal from './ContestModal';
import useStyles from './index.style';
import apis from '../../apis';

const Contest = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [keySearch, setKeySearch] = useState('');
  const [contests, setContests] = useState([]);
  const [contestSelect, setContestSelect] = useState(null);
  const [groupQuestions, setGroupQuestions] = useState([]);
  const [pagination, setPagination] = useState({
    rowsPerPage: 10,
    page: 0,
    count: 100,
  });

  const fetchContests = async () => {
    const data = await apis.contest.getContestsByUser();
    if (data && data.status) {
      const { result } = data;
      setPagination({
        ...pagination,
        count: result.metadata.count || 0,
      });
      setContests(result.data);
    } else {
      enqueueSnackbar((data && data.message) || 'Fetch data failed', {
        variant: 'error',
      });
    }
  };

  const fetchGroupQuestions = async (keyword) => {
    const data = await apis.groupQuestion.getGroupQuestions(keyword);
    if (data && data.status) {
      setGroupQuestions(data.result.data);
    } else {
      enqueueSnackbar((data && data.message) || 'Fetch data failed', {
        variant: 'error',
      });
    }
  };

  const handleChangePage = async (event, newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  useEffect(() => {
    fetchContests();
    fetchGroupQuestions();
  }, []);

  const handleSearch = async (e) => {
    const { value } = e.target;
    setKeySearch(value);
    setPagination({
      ...pagination,
      page: 0,
    });
  };

  const handleOpenModalAdd = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setContestSelect(null);
  };

  const handleClickRow = (row) => (e) => {
    e.preventDefault();
    setContestSelect(row);
    setOpenModal(true);
  };

  const handleUpdateContest = (item, type) => {
    if (type === 'ADD') {
      const newContests = [{ ...item }, ...contests];
      setContests(newContests);
      setKeySearch('');
      handleCloseModal();
      return;
    }
    const newContests = [...contests];
    const pos = newContests.findIndex((el) => el.id === item.id);
    newContests[pos] = { ...item };
    handleCloseModal();
    setContests(newContests);
  };

  const handleDeleteContest = async (id) => {
    const data = await apis.contest.deleteContest(id);
    if (data && data.status) {
      const newContests = [...contests];
      const pos = newContests.findIndex((el) => el.id === id);
      newContests.splice(pos, 1);
      setContests(newContests);
      enqueueSnackbar('Delete data success', {
        variant: 'success',
      });
    } else {
      enqueueSnackbar((data && data.message) || 'Delete data failed', {
        variant: 'error',
      });
    }
  };

  const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  return (
    <div>
      <Box mb={1}>
        <Typography variant="h6" gutterBottom>
          Danh sách cuộc thi
        </Typography>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box>
          <SearchBox handleSearch={handleSearch} />
        </Box>
        <Box display="flex">
          <Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<AddIcon />}
              onClick={handleOpenModalAdd}
            >
              Thêm cuộc thi
            </Button>
          </Box>
        </Box>
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell>Tên cuộc thi</TableCell>
                <TableCell align="center">Thời gian(phút)</TableCell>
                <TableCell align="center">Ngày</TableCell>
                <TableCell align="center">Mã code</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {contests
                .filter((el) => el.title.indexOf(keySearch) >= 0)
                .slice(
                  pagination.page * pagination.rowsPerPage,
                  pagination.page * pagination.rowsPerPage +
                    pagination.rowsPerPage,
                )
                .map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={classes.row}
                    onClick={handleClickRow(row)}
                  >
                    <TableCell align="center">
                      {pagination.page * pagination.rowsPerPage + index + 1}
                    </TableCell>

                    <TableCell
                      style={{
                        maxWidth: 200,
                      }}
                    >
                      {row.title}
                    </TableCell>
                    <TableCell align="center">{row.examTime}</TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column">
                        <div> BD: {moment(row.startTime).format('LLL')}</div>
                        <div>
                          KT:{' '}
                          {(row.endTime && moment(row.endTime).format('LLL')) ||
                            ''}
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {row.password && (
                        <Tooltip title={row.password}>
                          <LockIcon />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {row.isActive && (
                        <Box
                          style={{
                            color: '#000',
                            background: '#7beeab',
                            borderRadius: 5,
                            padding: 5,
                          }}
                        >
                          active
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <IconButton
                          aria-label="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContest(row.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          history.push(`/contest/${row.id}/exam/detail`);
                        }}
                      >
                        Thống kê
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {contests.length > 0 && pagination.count > pagination.rowsPerPage && (
            <TablePagination
              component="div"
              rowsPerPageOptions={[pagination.rowsPerPage]}
              count={
                contests
                  .filter((el) => el.title.indexOf(keySearch) >= 0)
                  .slice(
                    pagination.page * pagination.rowsPerPage,
                    pagination.page * pagination.rowsPerPage +
                      pagination.rowsPerPage,
                  ).length
              }
              page={pagination.page}
              onChangePage={handleChangePage}
              rowsPerPage={pagination.rowsPerPage}
            />
          )}
        </TableContainer>
      </Box>
      <ContestModal
        open={openModal}
        handleCloseModal={handleCloseModal}
        itemSelect={contestSelect}
        groupQuestions={groupQuestions}
        handleUpdateContest={handleUpdateContest}
      />
    </div>
  );
};

export default Contest;
