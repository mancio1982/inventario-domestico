// backend/src/routes/articoli.routes.js
const express = require('express');
const router = express.Router();
const articoliController = require('../controllers/articoli.controller');
const upload = require('../middleware/upload'); // Importa il middleware multer

// Configurazione di Multer per gestire campi specifici per immagini e documenti
// 'immagini' e 'documenti' devono corrispondere ai nomi dei campi nel FormData del frontend
// 'nuove_immagini' e 'nuovi_documenti' per l'update
const uploadFields = upload.fields([
    { name: 'immagini', maxCount: 5 }, // Max 5 immagini per upload
    { name: 'documenti', maxCount: 5 }, // Max 5 documenti per upload
    { name: 'nuove_immagini', maxCount: 5 },
    { name: 'nuovi_documenti', maxCount: 5 }
]);


// POST /api/articoli - Crea un nuovo articolo (con upload di file)
router.post('/', uploadFields, articoliController.create);

// GET /api/articoli - Recupera tutti gli articoli (con query params per filtri/paginazione)
router.get('/', articoliController.findAll);

// GET /api/articoli/:id - Recupera un singolo articolo
router.get('/:id', articoliController.findOne);

// PUT /api/articoli/:id - Aggiorna un articolo (con upload di nuovi file e gestione degli esistenti)
router.put('/:id', uploadFields, articoliController.update);

// DELETE /api/articoli/:id - Elimina un articolo
router.delete('/:id', articoliController.delete);

// DELETE /api/articoli/:articoloId/immagini/:immagineId - Elimina una specifica immagine da un articolo
router.delete('/:articoloId/immagini/:immagineId', articoliController.deleteImmagine);

// DELETE /api/articoli/:articoloId/documenti/:documentoId - Elimina un specifico documento da un articolo
router.delete('/:articoloId/documenti/:documentoId', articoliController.deleteDocumento);


module.exports = router;
