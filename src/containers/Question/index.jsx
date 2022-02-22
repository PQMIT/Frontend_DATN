/* eslint-disable radix */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import mongoid from 'mongoid-js';
import readXlsxFile from 'read-excel-file';
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
  Tooltip,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Backup as BackupIcon,
  InfoOutlined as InfoIcon,
} from '@material-ui/icons';
import SearchBox from '../../components/SearchBox';
import QuestionModal from './QuestionModal';
import UploadInfoModal from './UploadInfoModal';
import useStyles from './index.style';
import apis from '../../apis';

const Question = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { id: groupQuestionId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [openModalUploadInfo, setOpenModalUploadInfo] = useState(false);
  const [keySearch, setKeySearch] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionSelect, setQuestionSelect] = useState(null);
  const [pagination, setPagination] = useState({
    rowsPerPage: 10,
    page: 0,
    count: 100,
  });

  const fetchQuestions = async (param) => {
    const offset =
      param && param.offset >= 0
        ? param.offset
        : pagination.page * pagination.rowsPerPage;
    const query = {
      sort: (param && param.sort) || 'createdAt_desc',
      key: param && param.key,
      limit: (param && param.limit) || pagination.rowsPerPage,
      offset,
      groupQuestionId,
    };
    const data = await apis.question.getQuestionsInGroup({ ...query });
    if (data && data.status) {
      const { result } = data;
      setPagination({
        ...pagination,
        count: result.metadata.count || 0,
      });
      setQuestions(result.data);
    } else {
      enqueueSnackbar((data && data.message) || 'Fetch data failed', {
        variant: 'error',
      });
    }
  };

  const handleChangePage = async (event, newPage) => {
    await fetchQuestions({
      key: keySearch,
      offset: newPage * pagination.rowsPerPage,
    });
    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSearch = async (e) => {
    const { value } = e.target;
    setKeySearch(value);
    setPagination({
      ...pagination,
      page: 0,
    });
    await fetchQuestions({ key: value, offset: 0 });
  };

  const handleOpenModalAdd = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setQuestionSelect(null);
  };

  const handleOpenUploadInfoModal = (e) => {
    e.preventDefault();
    setOpenModalUploadInfo(true);
  };

  const handleCloseUploadInfoModal = () => {
    setOpenModalUploadInfo(false);
  };

  const handleClickRow = (row) => (e) => {
    e.preventDefault();
    setQuestionSelect(row);
    setOpenModal(true);
  };

  const handleUpdateQuestion = (item, type) => {
    if (type === 'ADD') {
      fetchQuestions({ offset: 0 });
      setKeySearch('');
      handleCloseModal();
      return;
    }
    const newQuestions = [...questions];
    const pos = newQuestions.findIndex((el) => el.id === item.id);
    newQuestions[pos] = { ...item };
    handleCloseModal();
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = async (id) => {
    const data = await apis.question.deleteQuestion(id);
    if (data && data.status) {
      fetchQuestions({ key: keySearch });
      enqueueSnackbar('Delete data success', {
        variant: 'success',
      });
    } else {
      enqueueSnackbar((data && data.message) || 'Delete data failed', {
        variant: 'error',
      });
    }
  };

  const validateQuestionInExcel = (row) => {
    const levels = ['EASY', 'MEDIUM', 'HARD'];
    console.log(row[row.length - 1]);
    const correctAnswer = parseInt(row[row.length - 1]);
    const amountAnswer = row.length - 5;
    console.log({ correctAnswer, amountAnswer });
    if (
      !row[0] ||
      levels.indexOf(row[0]) < 0 ||
      !row[2] ||
      amountAnswer < 2 ||
      !correctAnswer ||
      correctAnswer < 1 ||
      correctAnswer > amountAnswer
    )
      return false;

    return true;
  };

  const handleImportExcel = (e) => {
    e.preventDefault();
    enqueueSnackbar('Data is being processed, which may take a few minutes ', {
      variant: 'warning',
    });
    const file = e.target.files[0];
    try {
      readXlsxFile(file).then(async (rows) => {
        console.log(rows);

        await Promise.all(
          rows.map(async (el) => {
            const row = el
              .filter((ele) => ele)
              .map((ele) => ele.toString().trim());
            if (validateQuestionInExcel(row)) {
              const questionData = {
                level: row[0],
                title: row[1],
                description: row[2],
                explain: row[3],
                answers: row.slice(4, row.length - 1).map((ele, index) => ({
                  answerId: mongoid(),
                  position: index,
                  content: ele,
                  isCorrect: parseInt(row[row.length - 1]) === index + 1,
                })),
              };
              await apis.question.createQuestion({
                ...questionData,
                groupQuestion: groupQuestionId,
              });
            }
          }),
        );
        fetchQuestions({ offset: 0 });
        setKeySearch('');
        enqueueSnackbar('Import data success', {
          variant: 'success',
        });
      });
    } catch (error) {
      enqueueSnackbar('Import data failed', {
        variant: 'error',
      });
    }
  };

  return (
    <div>
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
          <Box mr={1} display="flex" alignItems="center">
            <Box mr={1} onClick={handleOpenUploadInfoModal}>
              <InfoIcon style={{ color: '#ccc', cursor: 'pointer' }} />
            </Box>
            <input
              accept="*"
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleImportExcel}
            />
            <label htmlFor="contained-button-file">
              <Tooltip title="Đọc kĩ hướng dẫn ở icon bên cạnh trước khi tải lên">
                <Button
                  size="large"
                  variant="contained"
                  style={{ color: '#fff', background: 'green' }}
                  component="span"
                  startIcon={<BackupIcon />}
                >
                  Tải lên
                </Button>
              </Tooltip>
            </label>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<AddIcon />}
              onClick={handleOpenModalAdd}
            >
              Thêm câu hỏi
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
                <TableCell>Tiêu đề câu hỏi</TableCell>
                <TableCell>Cấp độ</TableCell>
                <TableCell align="center">Số lượng câu trả lời</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={classes.row}
                  onClick={handleClickRow(row)}
                >
                  <TableCell align="center">
                    {pagination.page * pagination.rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell
                    classes={{
                      body:
                        row.level === 'HARD'
                          ? classes.redStatus
                          : row.level === 'MEDIUM'
                          ? classes.yellowStatus
                          : classes.greenStatus,
                    }}
                  >
                    {row.level}
                  </TableCell>
                  <TableCell align="center">
                    {row.answers && row.answers.length}
                  </TableCell>
                  <TableCell className={classes.actionBox}>
                    <Box>
                      <IconButton
                        aria-label="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(row.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {questions.length > 0 &&
            pagination.count > pagination.rowsPerPage && (
              <TablePagination
                component="div"
                rowsPerPageOptions={[pagination.rowsPerPage]}
                count={pagination.count}
                page={pagination.page}
                onChangePage={handleChangePage}
                rowsPerPage={pagination.rowsPerPage}
              />
            )}
        </TableContainer>
      </Box>
      <QuestionModal
        open={openModal}
        groupQuestionId={groupQuestionId}
        handleCloseModal={handleCloseModal}
        itemSelect={questionSelect}
        handleUpdateQuestion={handleUpdateQuestion}
      />
      <UploadInfoModal
        open={openModalUploadInfo}
        handleCloseModal={handleCloseUploadInfoModal}
      />
    </div>
  );
};

export default Question;
