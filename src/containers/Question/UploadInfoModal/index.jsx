/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Modal, Box, Typography, Button, Divider } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import useStyles from './index.style';

const UploadInfoModal = ({ handleCloseModal, open }) => {
  const classes = useStyles();

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={classes.paper}>
        <Box
          mb={1}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" gutterBottom>
            Hướng dẫn tải file
          </Typography>
          <Box onClick={handleCloseModal}>
            <CloseIcon style={{ color: '#ccc', cursor: 'pointer' }} />
          </Box>
        </Box>
        <Divider />
        <Box mt={2}>
          <Typography>
            Bạn cần tạo file excel theo format dưới đây để hệ thống có thể đọc
            được nội dụng 1 cách chính xác: <a href="fdsf">link</a>
          </Typography>
        </Box>
      </div>
    </Modal>
  );
};

export default UploadInfoModal;
