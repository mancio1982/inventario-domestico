// backend/src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Per servire file statici (immagini, documenti)
const db = require('./models'); // Importa l'istanza di Sequelize e i modelli

const app = express();

// Middleware
app.use(cors()); // Abilita CORS per tutte le route
app.use(express.json()); // Per parsare JSON bodies
app.use(express.urlencoded({ extended: true })); // Per parsare URL-encoded bodies

// Servire file statici dalla directory 'uploads'
// Il frontend accederà a questi file tramite un URL tipo: http://localhost:3001/uploads/nomefile.jpg
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));


// Sincronizzazione Database (opzionale, utile in sviluppo per creare tabelle se non esistono)
// In produzione, è meglio usare le migrazioni di Sequelize.
const syncDatabase = async () => {
  try {
    // await db.sequelize.sync({ force: true }); // ATTENZIONE: force: true droppa le tabelle esistenti! Usare con cautela.
    await db.sequelize.sync({ alter: true }); // alter: true tenta di alterare le tabelle per farle corrispondere ai modelli
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};
if (process.env.NODE_ENV === 'development') {
  // syncDatabase(); // Disabilitato di default, scommentare se si vuole sincronizzare all'avvio
}


// Routes
// Esempio di una route di test
app.get('/', (req, res) => {
  res.json({ message: 'Benvenuto nell API dell inventario domestico!' });
});

// Importa e usa le routes
const categorieRoutes = require('./routes/categorie.routes');
const posizioniRoutes = require('./routes/posizioni.routes');
const articoliRoutes = require('./routes/articoli.routes');
// Aggiungeremo altre routes qui (es. per report, upload)

app.use('/api/categorie', categorieRoutes);
app.use('/api/posizioni', posizioniRoutes);
app.use('/api/articoli', articoliRoutes);


// Middleware per la gestione degli errori (base)
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Errore interno del server';
  res.status(statusCode).json({ error: message });
});

// Avvio del Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server backend in ascolto sulla porta ${PORT}`);
  // La connessione al DB viene già testata in models/index.js
});

module.exports = app; // Per eventuali test
