// frontend/src/components/layout/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssessmentIcon from '@mui/icons-material/Assessment'; // Icona per Report
// import MenuIcon from '@mui/icons-material/Menu'; // Per un eventuale drawer menu

// Potresti voler usare useUIStore per gestire lo stato del drawer
// import useUIStore from '../../store/uiStore';

const Navbar = () => {
  // const { toggleDrawer } = useUIStore();

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Articoli', icon: <InventoryIcon />, path: '/articoli' },
    { text: 'Categorie', icon: <CategoryIcon />, path: '/categorie' },
    { text: 'Posizioni', icon: <LocationOnIcon />, path: '/posizioni' },
    { text: 'Report', icon: <AssessmentIcon />, path: '/report' },
  ];

  return (
    <AppBar position="static" color="primary"> {/* Usa il colore primario dal tema */}
      <Toolbar>
        {/* <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: 'none' } }} // Mostra solo su schermi piccoli per il drawer
          // onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton> */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Inventario Domestico
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}> {/* Nasconde su schermi extra-piccoli */}
          {navItems.map((item) => (
            <Button
              key={item.text}
              color="inherit"
              component={RouterLink}
              to={item.path}
              startIcon={item.icon}
              sx={{
                '&:hover': {
                  backgroundColor: 'primary.light', // Usa il colore primario chiaro dal tema
                },
                textTransform: 'none', // Già impostato globalmente, ma per sicurezza
                fontWeight: 'medium',
                mx: 0.5, // Margine orizzontale
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
