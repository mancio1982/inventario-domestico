// backend/src/config/database.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      // ssl: { // Abilita se il tuo DB richiede SSL (es. su Render)
      //   require: true,
      //   rejectUnauthorized: false // Potrebbe essere necessario a seconda della configurazione del server DB
      // }
    },
    logging: console.log, // Mostra le query SQL nel log, utile per il debug
  },
  test: {
    // ... configurazione per ambiente di test
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Su Render, questo è spesso necessario
      }
    },
    logging: false, // Disabilita il logging delle query in produzione
  }
};
