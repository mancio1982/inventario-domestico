// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ArticoliPage from './pages/ArticoliPage';
import AddArticoloPage from './pages/AddArticoloPage';
import EditArticoloPage from './pages/EditArticoloPage';
import CategoriePage from './pages/CategoriePage';
import PosizioniPage from './pages/PosizioniPage';
import ReportsPage from './pages/ReportsPage';
import NotFoundPage from './pages/NotFoundPage';

// Componenti Snackbar e Loader globali (da creare)
import GlobalSnackbar from './components/common/GlobalSnackbar';
import GlobalLoader from './components/common/GlobalLoader'; // Importa il loader

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, py: 3 /* Padding y-axis */ }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articoli" element={<ArticoliPage />} />
          <Route path="/articoli/nuovo" element={<AddArticoloPage />} />
          <Route path="/articoli/modifica/:id" element={<EditArticoloPage />} />
          <Route path="/categorie" element={<CategoriePage />} />
          <Route path="/posizioni" element={<PosizioniPage />} />
          <Route path="/report" element={<ReportsPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate replace to="/404" />} />
        </Routes>
      </Container>
      <Footer />
      <GlobalSnackbar />
      <GlobalLoader /> {/* Aggiungi il loader globale */}
    </Box>
  );
}

export default App;
