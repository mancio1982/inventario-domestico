// frontend/src/components/layout/Footer.jsx
import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2, // Padding verticale
        px: 2, // Padding orizzontale
        mt: 'auto', // Spinge il footer in basso
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Inventario Domestico. Creato con '}
          <Link color="inherit" href="https://react.dev/" target="_blank" rel="noopener">
            React
          </Link>
          {' & '}
          <Link color="inherit" href="https://mui.com/" target="_blank" rel="noopener">
            Material UI
          </Link>
          .
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
