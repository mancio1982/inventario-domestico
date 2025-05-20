// frontend/src/components/common/GlobalLoader.jsx
import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import useUIStore from '../../store/uiStore';

const GlobalLoader = () => {
  const isLoading = useUIStore((state) => state.isLoading);

  return (
    <Backdrop
      sx={{ color: (theme) => theme.palette.primary.contrastText, zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default GlobalLoader;
