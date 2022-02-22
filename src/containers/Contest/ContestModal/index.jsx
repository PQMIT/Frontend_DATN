/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  Modal,
  TextField,
  Box,
  Typography,
  Button,
  Grid,
  Switch,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import useStyles from './index.style';
import apis from '../../../apis';
import { setDate, setTime } from '../../../utils/date';

const ContestModal = ({
  handleCloseModal,
  open,
  itemSelect,
  handleUpdateContest,
  groupQuestions,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [contest, setContest] = useState();

  const handleDateChange = (type) => (date) => {
    let startTime = contest && contest.startTime;
    let endTime = contest && contest.endTime;
    switch (type) {
      case 'startDate':
        startTime = setDate(startTime || date, date);
        break;
      case 'startTime':
        startTime = setTime(startTime || date, date);
        break;
      case 'endDate':
        endTime = setDate(endTime || date, date);
        break;
      case 'endTime':
        endTime = setTime(endTime || date, date);
        break;
      default:
    }

    setContest({
      ...contest,
      startTime,
      endTime,
    });
  };

  useEffect(() => {
    setContest(itemSelect);
  }, [itemSelect, open]);

  const handleChange = (e) => {
    // eslint-disable-next-line prefer-const
    let { name, value } = e.target;
    if (name === 'isActive') value = e.target.checked;
    setContest({
      ...contest,
      [name]: value,
    });
  };

  const validateContest = (item) => {
    if (!item.title || item.title.trim().length <= 0) {
      enqueueSnackbar('Title is not empty', {
        variant: 'error',
      });
      return false;
    }

    if (!item.examTime) {
      enqueueSnackbar('Min is not empty', {
        variant: 'error',
      });
      return false;
    }
    const regexNumber = /^\d+$/;
    // eslint-disable-next-line radix
    const checkNumber = regexNumber.test(item.examTime);
    if (!checkNumber) {
      enqueueSnackbar('Min must a number', {
        variant: 'error',
      });
      return false;
    }

    if (!item.groupQuestion) {
      enqueueSnackbar("You haven't choose group question", {
        variant: 'error',
      });
      return false;
    }
    if (!item.startTime) {
      enqueueSnackbar("You haven't set start time", {
        variant: 'error',
      });
      return false;
    }
    if (item.endTime && item.startTime >= item.endTime) {
      enqueueSnackbar('end time must greater than start time', {
        variant: 'error',
      });
      return false;
    }

    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let data = null;
    if (!validateContest(contest)) return;

    const contestData = {
      ...contest,
      groupQuestion: contest.groupQuestion,
      isActive: contest.isActive || false,
    };
    if (itemSelect && itemSelect.id) {
      data = await apis.contest.updateContest(itemSelect.id, contestData);
    } else {
      data = await apis.contest.createContest(contestData);
    }
    if (data && data.status) {
      const { contest: newContest } = data.result;
      const type = itemSelect && itemSelect.id ? 'UPDATE' : 'ADD';
      handleUpdateContest(newContest, type);
      enqueueSnackbar('Save data success', {
        variant: 'success',
      });
    } else {
      enqueueSnackbar((data && data.message) || 'Save data failed', {
        variant: 'error',
      });
    }
  };

  const handleUploadImage = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append('file', file);
    const data = await apis.upload.uploadFile({ formData });
    if (data && data.status) {
      setContest({
        ...contest,
        imageUrl: data.result.link,
      });
    } else {
      enqueueSnackbar('Upload failed', {
        variant: 'error',
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={classes.paper}>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Thông tin cuộc thi
          </Typography>
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Tên cuộc thi"
            variant="outlined"
            name="title"
            value={(contest && contest.title) || ''}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Mô tả chi tiết"
            variant="outlined"
            multiline
            rows={5}
            name="description"
            value={(contest && contest.description) || ''}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Thời gian thi(m)"
            variant="outlined"
            name="examTime"
            value={(contest && contest.examTime) || ''}
            onChange={handleChange}
          />
        </Box>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                type="file"
                onChange={handleUploadImage}
              />
              <label htmlFor="contained-button-file">
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  component="span"
                  fullWidth
                  style={{
                    height: '100%',
                  }}
                >
                  TẢI ẢNH
                </Button>
              </label>
            </Grid>
            <Grid item xs={10}>
              <TextField
                fullWidth
                label="Link ảnh"
                variant="outlined"
                name="imageUrl"
                value={(contest && contest.imageUrl) || ''}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>
        <Box mb={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  style={{ justifyContent: 'center' }}
                >
                  Ngày bắt đầu
                </Typography>
                <KeyboardDatePicker
                  margin="normal"
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  value={(contest && contest.startTime) || null}
                  onChange={handleDateChange('startDate')}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  style={{ marginTop: 0 }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  style={{ justifyContent: 'center' }}
                >
                  Thời gian bắt đầu
                </Typography>
                <KeyboardTimePicker
                  margin="normal"
                  inputVariant="outlined"
                  value={(contest && contest.startTime) || null}
                  onChange={handleDateChange('startTime')}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                  style={{ marginTop: 0 }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  style={{ justifyContent: 'center' }}
                >
                  Ngày kết thúc
                </Typography>

                <KeyboardDatePicker
                  margin="normal"
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  value={(contest && contest.endTime) || null}
                  onChange={handleDateChange('endDate')}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  style={{ marginTop: 0 }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  style={{ justifyContent: 'center' }}
                >
                  Thời gian kết thúc
                </Typography>
                <KeyboardTimePicker
                  margin="normal"
                  inputVariant="outlined"
                  value={(contest && contest.endTime) || null}
                  onChange={handleDateChange('endTime')}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                  style={{ marginTop: 0 }}
                />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
        </Box>

        <Box mb={2}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">
              Bộ câu hỏi
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              value={contest && contest.groupQuestion}
              name="groupQuestion"
              onChange={handleChange}
              label="Group Question"
            >
              {groupQuestions.map((el) => (
                <MenuItem value={el.id} key={el.id}>
                  <em>{el.title}</em>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Mã code (nếu có)"
            variant="outlined"
            name="password"
            value={(contest && contest.password) || ''}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={(contest && contest.isActive) || false}
                onChange={handleChange}
                name="isActive"
                color="primary"
              />
            }
            label="Cuộc thi sẽ được hiển thị lên hệ thống"
          />
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Box mr={1}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSave}
            >
              Lưu
            </Button>
          </Box>
          <Box>
            <Button variant="contained" size="large" onClick={handleCloseModal}>
              Hủy bỏ
            </Button>
          </Box>
        </Box>
      </div>
    </Modal>
  );
};

export default ContestModal;
