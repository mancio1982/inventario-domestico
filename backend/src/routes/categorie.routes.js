// backend/src/routes/categorie.routes.js
const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorie.controller');

// POST /api/categorie - Crea una nuova categoria
router.post('/', categorieController.create);

// GET /api/categorie - Recupera tutte le categorie
router.get('/', categorieController.findAll);

// GET /api/categorie/:id - Recupera una singola categoria
router.get('/:id', categorieController.findOne);

// PUT /api/categorie/:id - Aggiorna una categoria
router.put('/:id', categorieController.update);

// DELETE /api/categorie/:id - Elimina una categoria
router.delete('/:id', categorieController.delete);

module.exports = router;
