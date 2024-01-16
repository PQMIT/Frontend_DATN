/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import mongoid from 'mongoid-js';
import {
  Modal,
  TextField,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  RootRef,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from '@material-ui/core';
import { Remove as RemoveIcon, Add as AddIcon } from '@material-ui/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import LevelsQuestion from '../../../data/levelsQuestion';
import useStyles from './index.style';
import apis from '../../../apis';

const QuestionModal = ({
  handleCloseModal,
  open,
  itemSelect,
  handleUpdateQuestion,
  groupQuestionId,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [question, setQuestion] = useState();
  useEffect(() => {}, [open]);

  useEffect(() => {
    setQuestion(itemSelect);
  }, [itemSelect, open]);

  const handleAddAnswer = (e) => {
    e.preventDefault();
    const answerData = {
      answerId: mongoid(),
      position: (question && question.answers && question.answers.length) || 0,
      content: '',
      isCorrect: false,
    };
    setQuestion({
      ...question,
      answers:
        question && question.answers
          ? [...question.answers, answerData]
          : [answerData],
    });
  };

  const handleChange = (e) => {
    setQuestion({
      ...question,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteAnswer = (pos) => () => {
    const newAnswers = question && question.answers;
    newAnswers.splice(pos, 1);
    setQuestion({
      ...question,
      answers: [...newAnswers],
    });
  };

  const handleEditAnswer = (pos) => (e) => {
    const newAnswers = question && question.answers;
    newAnswers[pos] = {
      ...newAnswers[pos],
      content: e.target.value,
    };
    setQuestion({
      ...question,
      answers: [...newAnswers],
    });
  };

  const validateQuestion = (item) => {
    if (item.description.trim().length <= 0) {
      enqueueSnackbar('Description is not empty', {
        variant: 'error',
      });
      return false;
    }
    if (item.answers.length < 2) {
      enqueueSnackbar('Must have at least 2 answers', {
        variant: 'error',
      });
      return false;
    }
    const questionCorrect = item.answers.find((el) => el.isCorrect);
    if (!questionCorrect) {
      enqueueSnackbar('You have not chosen the correct answer', {
        variant: 'error',
      });
      return false;
    }
    return true;
  };
  const handleSave = async (e) => {
    e.preventDefault();
    let data = null;
    if (!validateQuestion(question)) return;
    if (itemSelect && itemSelect.id) {
      data = await apis.question.updateQuestion(itemSelect.id, {
        ...question,
        level: question.level || 'EASY',
        groupQuestion: groupQuestionId,
      });
    } else {
      data = await apis.question.createQuestion({
        ...question,
        level: question.level || 'EASY',
        groupQuestion: groupQuestionId,
      });
    }
    if (data && data.status) {
      const { question: newQuestion } = data.result;
      const type = itemSelect && itemSelect.id ? 'UPDATE' : 'ADD';
      handleUpdateQuestion(newQuestion, type);
      enqueueSnackbar('Save data success', {
        variant: 'success',
      });
    } else {
      enqueueSnackbar((data && data.message) || 'Save data failed', {
        variant: 'error',
      });
    }
  };

  const handleChooseCorrectAnswer = (pos) => () => {
    let newAnswers = question && question.answers;
    newAnswers = newAnswers.map((el, index) => ({
      ...el,
      isCorrect: index === pos,
    }));
    setQuestion({
      ...question,
      answers: [...newAnswers],
    });
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle,

    ...(isDragging && {
      background: 'rgb(235,235,235)',
    }),
  });

  const handleDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    const newAnswers = question && question.answers;

    newAnswers[startIndex].position = endIndex;
    newAnswers[endIndex].position = startIndex;

    const [removed] = newAnswers.splice(startIndex, 1);
    newAnswers.splice(endIndex, 0, removed);

    setQuestion({
      ...question,
      answers: newAnswers,
    });
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
            Thông tin câu hỏi
          </Typography>
        </Box>
        <Box mb={2}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Cấp độ câu hỏi</InputLabel>
            <Select
              name="level"
              label="Cấp độ câu hỏi"
              value={(question && question.level) || 'EASY'}
              onChange={handleChange}
            >
              {LevelsQuestion.map((el) => (
                <MenuItem value={el} key={el}>
                  {el}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Tiêu đề câu hỏi"
            variant="outlined"
            name="title"
            value={(question && question.title) || ''}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Nội dung câu hỏi"
            variant="outlined"
            multiline
            rows={10}
            name="description"
            value={(question && question.description) || ''}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2} className={classes.listAnswer}>
          <Box display="flex" alignItems="center">
            {/* <QuestionAnswerIcon /> */}

            <Typography variant="h6" className={classes.textCreateAnswer}>
              Danh sách đáp án
            </Typography>
          </Box>
          <Box>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <RootRef rootRef={provided.innerRef}>
                    <List>
                      {question &&
                        question.answers &&
                        question.answers.map((item, index) => (
                          <Draggable
                            key={`item-${index}`}
                            draggableId={`item-${index}`}
                            index={index}
                          >
                            {(providedItem, snapshotItem) => (
                              <ListItem
                                ContainerComponent="li"
                                ContainerProps={{ ref: providedItem.innerRef }}
                                {...providedItem.draggableProps}
                                {...providedItem.dragHandleProps}
                                style={getItemStyle(
                                  snapshotItem.isDragging,
                                  providedItem.draggableProps.style,
                                )}
                              >
                                <ListItemIcon>
                                  <div onClick={handleDeleteAnswer(index)}>
                                    <IconButton>
                                      <RemoveIcon />
                                    </IconButton>
                                  </div>
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Box>
                                      <Checkbox
                                        checked={item.isCorrect}
                                        onChange={handleChooseCorrectAnswer(
                                          index,
                                        )}
                                        inputProps={{
                                          'aria-label': 'primary checkbox',
                                        }}
                                      />
                                      <TextField
                                        value={item.content}
                                        onChange={handleEditAnswer(index)}
                                      />
                                    </Box>
                                  }
                                />
                                <ListItemSecondaryAction />
                              </ListItem>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </List>
                  </RootRef>
                )}
              </Droppable>
            </DragDropContext>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleAddAnswer}
            >
              Thêm
            </Button>
          </Box>
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Giải thích đáp án"
            variant="outlined"
            multiline
            rows={5}
            name="explain"
            value={(question && question.explain) || ''}
            onChange={handleChange}
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

export default QuestionModal;
