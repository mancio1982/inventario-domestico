// backend/src/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads/'; // Dalla variabile d'ambiente
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // Default 5MB

// Assicurati che la directory di upload esista
const uploadPath = path.join(__dirname, '..', '..', UPLOAD_DIR); // Va alla root del backend e poi a UPLOAD_DIR
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configurazione dello storage per Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // Salva i file nella directory UPLOAD_DIR
  },
  filename: (req, file, cb) => {
    // Genera un nome file univoco per evitare sovrascritture
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro per i tipi di file (esempio per immagini e PDF)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Tipo di file non supportato: ' + file.mimetype + '. Sono permessi solo: ' + allowedTypes));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE }, // Limite sulla dimensione del file
  fileFilter: fileFilter
});

module.exports = upload;
