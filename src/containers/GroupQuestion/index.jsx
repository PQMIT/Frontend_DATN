/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Button,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Image as ImageIcon,
  MoreVert as MoreVertIcon,
} from '@material-ui/icons';
import useStyles from './index.style';
import apis from '../../apis';
import GroupQuestionModal from './GroupQuestionModal';
import SearchBox from '../../components/SearchBox';
import LoadingPage from '../../components/LoadingPage';

let timeOutId = null;
const GroupQuestion = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [keySearch, setKeySearch] = useState('');
  const [groupQuestionSelected, setGroupQuestionSelected] = useState();
  const [groupQuestions, setGroupQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroupQuestions = async (keyword) => {
    const data = await apis.groupQuestion.getGroupQuestions(keyword);
    if (data && data.status) {
      setGroupQuestions(data.result.data);
      setIsLoading(false);
    } else {
      enqueueSnackbar((data && data.message) || 'Fetch data failed', {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    fetchGroupQuestions();
  }, []);

  const handleOpenToggle = (el) => (event) => {
    setAnchorEl(event.currentTarget);
    setGroupQuestionSelected(el);
  };

  const handleCloseToggle = () => {
    setAnchorEl(null);
  };

  const handleOpenEdit = () => {
    setAnchorEl(null);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    setAnchorEl(null);
    try {
      await apis.groupQuestion.deleteGroupQuestions(groupQuestionSelected.id);
      const newGroupQuestions = [...groupQuestions];
      const tempGroupQuestions = newGroupQuestions.filter(
        (ele) => ele.id !== groupQuestionSelected.id,
      );
      setGroupQuestions(tempGroupQuestions);
      enqueueSnackbar('Delete success', {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar('Delete data failed', {
        variant: 'error',
      });
    }
  };

  const handleOpenModalAdd = (e) => {
    e.preventDefault();
    setGroupQuestionSelected(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setKeySearch(value);
    clearTimeout(timeOutId);
    timeOutId = setTimeout(() => {
      fetchGroupQuestions(value);
    }, 100);
  };
  const handleSave = (el) => async (e) => {
    e.preventDefault();

    if (el.id) {
      const { title, description, imageUrl } = el;
      const data = await apis.groupQuestion.updateGroupQuestions(el.id, {
        title,
        description,
        imageUrl,
      });
      if (data && data.status) {
        setOpenModal(false);
        const newGroupQuestions = [...groupQuestions];
        const pos = newGroupQuestions.findIndex((ele) => ele.id === el.id);
        newGroupQuestions[pos] = { ...data.result.groupQuestion };
        setGroupQuestions(newGroupQuestions);
        enqueueSnackbar('Update success', { variant: 'success' });
      } else {
        enqueueSnackbar((data && data.message) || 'Update failed', {
          variant: 'error',
        });
      }
    } else {
      const { title, description, imageUrl } = el;
      if (title.trim().length <= 0) {
        enqueueSnackbar("Title doesn't empty ", { variant: 'error' });
        return;
      }
      const data = await apis.groupQuestion.createGroupQuestion({
        title,
        description,
        imageUrl,
      });
      if (data && data.status) {
        setOpenModal(false);
        const newGroupQuestions = [...groupQuestions];
        newGroupQuestions.push({ ...data.result.groupQuestion });
        setGroupQuestions(newGroupQuestions);
        enqueueSnackbar('Create success', { variant: 'success' });
      } else {
        enqueueSnackbar((data && data.message) || 'Create failed', {
          variant: 'error',
        });
      }
    }
  };

  const handleClickItem = (id) => () => {
    history.push(`/groupQuestions/${id}/questions`);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div>
      <Box mb={1}>
        <Typography variant="h6" gutterBottom>
          Danh sách bộ câu hỏi
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
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            startIcon={<AddIcon />}
            onClick={handleOpenModalAdd}
          >
            Thêm bộ câu hỏi
          </Button>
        </Box>
      </Box>
      {groupQuestions.length === 0 ? (
        <Typography
          variant="subtitle1"
          gutterBottom
          align="center"
          style={{ color: '#ccc' }}
        >
          Không có dữ liệu
        </Typography>
      ) : (
        <List>
          {groupQuestions.map((el) => (
            <ListItem
              className={classes.listItem}
              key={el.id}
              onClick={handleClickItem(el.id)}
            >
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                classes={{
                  primary: classes.textPrimary,
                }}
                primary={el.title}
                secondary={el.description}
              />
              {/* <ListItemText>
              <Box display="flex" alignItems="flex-end">
                <Box mr={1}>
                  <Typography variant="button" component="h2">
                    Amount Question:
                  </Typography>
                </Box>
                <Typography variant="h5" component="h2">
                  10
                </Typography>
              </Box>
            </ListItemText> */}
              <ListItemSecondaryAction>
                <div onClick={handleOpenToggle(el)}>
                  <IconButton edge="end" aria-label="more">
                    <MoreVertIcon />
                  </IconButton>
                </div>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
      <Menu
        classes={{
          paper: classes.menusToggle,
        }}
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseToggle}
      >
        <MenuItem onClick={handleOpenEdit}>Sửa</MenuItem>
        <MenuItem onClick={handleDelete}>Xóa</MenuItem>
      </Menu>
      <GroupQuestionModal
        open={openModal}
        item={groupQuestionSelected}
        handleCloseModal={handleCloseModal}
        handleSave={handleSave}
      />
    </div>
  );
};

export default GroupQuestion;
