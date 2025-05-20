// frontend/src/pages/ArticoliPage.jsx
import React from 'react';
import { Typography, Container, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

// Più avanti qui ci sarà la lista degli articoli, filtri, ecc.
// import ArticoliList from '../components/features/articoli/ArticoliList';

const ArticoliPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Elenco Articoli
        </Typography>
        <Button
          variant="contained"
          color="secondary" // Usa il colore secondario (verde)
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/articoli/nuovo"
        >
          Nuovo Articolo
        </Button>
      </Box>
      <Typography paragraph color="text.secondary">
        Qui verrà visualizzata la lista degli articoli, con opzioni di ricerca e filtraggio.
      </Typography>
      {/* <ArticoliList /> */}
    </Container>
  );
};

export default ArticoliPage;
