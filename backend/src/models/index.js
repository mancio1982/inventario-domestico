// backend/src/models/index.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); // Assicura che .env sia caricato

const env = process.env.NODE_ENV || 'development';
const config = require('../config/database.js')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Test della connessione
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
testConnection();


// Caricamento dei modelli (verranno definiti successivamente)
// Esempio: db.User = require('./user.model.js')(sequelize, Sequelize);
db.Categorie = require('./categorie.model.js')(sequelize, Sequelize.DataTypes);
db.Posizioni = require('./posizioni.model.js')(sequelize, Sequelize.DataTypes);
db.Articoli = require('./articoli.model.js')(sequelize, Sequelize.DataTypes);
db.ArticoloImmagini = require('./articoloImmagini.model.js')(sequelize, Sequelize.DataTypes);
db.ArticoloDocumenti = require('./articoloDocumenti.model.js')(sequelize, Sequelize.DataTypes);


// Definizione delle associazioni tra i modelli
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; // Istanza di Sequelize
db.Sequelize = Sequelize; // Libreria Sequelize

module.exports = db;
