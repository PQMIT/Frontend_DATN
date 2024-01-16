import React from 'react';
import { Box, Typography } from '@material-ui/core';

const LoadingPage = ({ title = '' }) => {
  return (
    <Box>
      <Typography variant="h6" style={{ color: '#ccc' }}>
        Loading {title}...
      </Typography>
    </Box>
  );
};

export default LoadingPage;
