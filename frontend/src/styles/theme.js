// frontend/src/styles/theme.js
import { createTheme } from '@mui/material/styles';

// Palette Colori (Elegante Verde e Blu)
const primaryBlue = '#2C3E50'; // Blu Notte Scuro
const secondaryBlue = '#3498DB'; // Blu Chiaro Brillante

const primaryGreen = '#2ECC71'; // Verde Smeraldo
const secondaryGreen = '#1ABC9C'; // Turchese (o un verde più tenue se preferito come accento)

const lightBackground = '#ECF0F1'; // Grigio Argento Chiaro
const darkText = '#34495E'; // Grigio Asfalto Scuro
const lightText = '#FFFFFF';

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryBlue, // Il blu principale per elementi come app bar, bottoni primari
      light: '#546E7A', // Una versione più chiara del blu primario
      dark: '#1C2B36',  // Una versione più scura
      contrastText: lightText,
    },
    secondary: {
      main: primaryGreen, // Il verde come colore secondario o d'accento
      light: '#58D68D',
      dark: '#28B463',
      contrastText: lightText,
    },
    background: {
      default: lightBackground, // Sfondo principale dell'applicazione
      paper: '#FFFFFF',        // Sfondo per componenti come Card, Paper
    },
    text: {
      primary: darkText,          // Colore testo principale
      secondary: '#7F8C8D',      // Grigio Nuvola per testo secondario o meno importante
    },
    // Puoi definire colori personalizzati se necessario
    customBlue: {
        main: secondaryBlue,
        contrastText: lightText,
    },
    customGreen: {
        main: secondaryGreen,
        contrastText: lightText,
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
    // ... altre personalizzazioni tipografiche
  },
  components: {
    // Personalizzazione globale dei componenti MUI
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Bordi leggermente arrotondati per i bottoni
          textTransform: 'none', // Evita il MAIUSCOLO di default
        },
        containedPrimary: {
            // Stili specifici per bottoni contained con colore primario
        },
        containedSecondary: {
            // Stili specifici per bottoni contained con colore secondario
        }
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          // Esempio: ombra più leggera per l'AppBar
          // boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 12,
            }
        }
    }
    // ... altre personalizzazioni per TextField, Table, ecc.
  },
});
