// backend/src/routes/posizioni.routes.js
const express = require('express');
const router = express.Router();
const posizioniController = require('../controllers/posizioni.controller');

// POST /api/posizioni - Crea una nuova posizione
router.post('/', posizioniController.create);

// GET /api/posizioni - Recupera tutte le posizioni (opzionalmente filtrate per categoriaId)
router.get('/', posizioniController.findAll);

// GET /api/posizioni/:id - Recupera una singola posizione
router.get('/:id', posizioniController.findOne);

// PUT /api/posizioni/:id - Aggiorna una posizione
router.put('/:id', posizioniController.update);

// DELETE /api/posizioni/:id - Elimina una posizione
router.delete('/:id', posizioniController.delete);

module.exports = router;
