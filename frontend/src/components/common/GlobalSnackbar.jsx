// frontend/src/components/common/GlobalSnackbar.jsx
import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import useUIStore from '../../store/uiStore';

const GlobalSnackbar = () => {
  const { snackbar, closeSnackbar } = useUIStore();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    closeSnackbar();
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000} // Durata in ms
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
