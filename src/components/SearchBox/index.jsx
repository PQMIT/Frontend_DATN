import React from 'react';
import { TextField, InputAdornment } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

const SearchBox = ({
  title = '',
  handleSearch,
  size = 'small',
  position = 'end',
  variant = 'outlined',
}) => {
  return (
    <TextField
      variant={variant}
      size={size}
      InputProps={{
        startAdornment: (
          <InputAdornment position={position}>
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      placeholder={`Tìm kiếm  ${title}`}
      onChange={handleSearch}
    />
  );
};

export default SearchBox;
