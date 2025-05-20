// frontend/src/pages/HomePage.jsx
import React from 'react';
import { Typography, Container, Paper, Grid, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const HomePage = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Benvenuto nel tuo Inventario Domestico
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Gestisci facilmente tutti gli oggetti della tua casa, tieni traccia delle garanzie,
          dei valori e molto altro.
        </Typography>
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<InventoryIcon />}
              component={RouterLink}
              to="/articoli"
              size="large"
            >
              Visualizza Articoli
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              sx={{ // Usa colori custom definiti nel tema, se vuoi
                borderColor: 'customGreen.main',
                color: 'customGreen.main',
                '&:hover': {
                    backgroundColor: (theme) => theme.palette.customGreen.main + '20', // Leggera trasparenza
                    borderColor: 'customGreen.dark',
                }
              }}
              startIcon={<AddCircleOutlineIcon />}
              component={RouterLink}
              to="/articoli/nuovo"
              size="large"
            >
              Aggiungi Articolo
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default HomePage;
