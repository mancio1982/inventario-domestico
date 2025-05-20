// backend/src/controllers/articoli.controller.js
const { Articoli, Categorie, Posizioni, ArticoloImmagini, ArticoloDocumenti, sequelize } = require('../models');
const path = "path"; // Dovresti importare 'path'
const fs = "fs"; // Dovresti importare 'fs'

// Funzione helper per gestire gli upload e salvare i riferimenti
async function handleFileUploads(articoloId, files, tipo, transaction) {
  const fileRecords = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const fileRecord = {
        articolo_id: articoloId,
        // L'URL sarà relativo alla directory 'uploads' servita staticamente
        // Es: 'uploads/nomefile-timestamp.jpg'
        // Il frontend lo richiederà come 'http://localhost:3001/uploads/nomefile-timestamp.jpg'
        [tipo === 'immagine' ? 'image_url' : 'document_url']: `${process.env.UPLOAD_DIR || 'uploads/'}${file.filename}`,
        nome_file: file.originalname,
        tipo_file: file.mimetype,
        dimensione_file: file.size,
      };
      if (tipo === 'immagine') {
        fileRecords.push(ArticoloImmagini.create(fileRecord, { transaction }));
      } else {
        fileRecords.push(ArticoloDocumenti.create(fileRecord, { transaction }));
      }
    }
    await Promise.all(fileRecords);
  }
}

// Crea un nuovo articolo
exports.create = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { nome, descrizione, categoria_id, posizione_id, quantita, prezzo_acquisto, data_acquisto, valore_stimato, luogo_acquisto, garanzia_scadenza, note, codice_barre } = req.body;

    if (!nome) {
      await transaction.rollback();
      return res.status(400).json({ error: "Il nome dell'articolo è obbligatorio." });
    }

    const nuovoArticolo = await Articoli.create({
      nome, descrizione, categoria_id, posizione_id, quantita, prezzo_acquisto,
      data_acquisto: data_acquisto || null,
      valore_stimato, luogo_acquisto,
      garanzia_scadenza: garanzia_scadenza || null,
      note, codice_barre
    }, { transaction });

    // req.files conterrà un array di file se usi upload.array('nomeCampoImmagini')
    // req.files['immagini'] e req.files['documenti'] se usi upload.fields(...)
    const immagini = req.files && req.files.immagini ? req.files.immagini : [];
    const documenti = req.files && req.files.documenti ? req.files.documenti : [];

    await handleFileUploads(nuovoArticolo.id, immagini, 'immagine', transaction);
    await handleFileUploads(nuovoArticolo.id, documenti, 'documento', transaction);

    await transaction.commit();
    const articoloCompleto = await Articoli.findByPk(nuovoArticolo.id, {
        include: ['categoria', 'posizione', 'immagini', 'documenti']
    });
    res.status(201).json(articoloCompleto);
  } catch (error) {
    await transaction.rollback();
    // Se c'è un errore dopo che i file sono stati salvati da multer ma prima del commit,
    // potresti voler eliminare i file orfani.
    if (req.files) {
        const allFiles = [...(req.files.immagini || []), ...(req.files.documenti || [])];
        allFiles.forEach(file => {
            // fs.unlink(file.path, err => { // path corretto del file
            //     if (err) console.error("Errore eliminazione file orfano:", err);
            // });
            console.warn("File orfano potrebbe essere stato creato:", file.path, "a causa di un errore di transazione.");
        });
    }
    console.error("Errore creazione articolo:", error);
    res.status(500).json({ error: "Errore durante la creazione dell'articolo.", details: error.message });
  }
};

// Recupera tutti gli articoli (con filtri e paginazione opzionali)
exports.findAll = async (req, res) => {
  try {
    // Qui implementeremo la logica di ricerca e filtraggio più avanti
    const { search, categoria, posizione, sortBy, order = 'ASC', page = 1, limit = 10 } = req.query;
    const whereClause = {};
    const offset = (page - 1) * limit;

    if (search) {
        const { Op } = require('sequelize');
        whereClause[Op.or] = [
            { nome: { [Op.iLike]: `%${search}%` } }, // iLike per case-insensitive
            { descrizione: { [Op.iLike]: `%${search}%` } },
            { codice_barre: { [Op.iLike]: `%${search}%` } }
        ];
    }
    if (categoria) whereClause.categoria_id = categoria;
    if (posizione) whereClause.posizione_id = posizione;

    const orderClause = sortBy ? [[sortBy, order.toUpperCase()]] : [['nome', 'ASC']];

    const articoli = await Articoli.findAndCountAll({
      where: whereClause,
      include: [
        { model: Categorie, as: 'categoria', attributes: ['id', 'nome'] }, // Seleziona solo alcuni attributi
        { model: Posizioni, as: 'posizione', attributes: ['id', 'nome'] },
        { model: ArticoloImmagini, as: 'immagini', attributes: ['id', 'image_url', 'descrizione_immagine'] },
        { model: ArticoloDocumenti, as: 'documenti', attributes: ['id', 'document_url', 'nome_file', 'tipo_file'] }
      ],
      order: orderClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true, // Importante con include e limit/offset per un conteggio corretto
    });
    res.status(200).json({
        totalItems: articoli.count,
        items: articoli.rows,
        totalPages: Math.ceil(articoli.count / limit),
        currentPage: parseInt(page)
    });
  } catch (error) {
    console.error("Errore recupero articoli:", error);
    res.status(500).json({ error: "Errore durante il recupero degli articoli.", details: error.message });
  }
};

// Recupera un singolo articolo con id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const articolo = await Articoli.findByPk(id, {
      include: [
        { model: Categorie, as: 'categoria' },
        { model: Posizioni, as: 'posizione' },
        { model: ArticoloImmagini, as: 'immagini' },
        { model: ArticoloDocumenti, as: 'documenti' }
      ]
    });
    if (articolo) {
      res.status(200).json(articolo);
    } else {
      res.status(404).json({ error: `Articolo con id=${id} non trovato.` });
    }
  } catch (error) {
    console.error(`Errore recupero articolo id=${req.params.id}:`, error);
    res.status(500).json({ error: "Errore durante il recupero dell'articolo." });
  }
};

// Aggiorna un articolo
exports.update = async (req, res) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const { nome, descrizione, categoria_id, posizione_id, quantita, prezzo_acquisto, data_acquisto, valore_stimato, luogo_acquisto, garanzia_scadenza, note, codice_barre } = req.body;

        const articolo = await Articoli.findByPk(id, { transaction });
        if (!articolo) {
            await transaction.rollback();
            return res.status(404).json({ error: `Articolo con id=${id} non trovato.` });
        }

        // Lista degli ID delle immagini/documenti da mantenere (inviati dal frontend)
        const immaginiDaMantenereIds = req.body.immagini_esistenti_ids ? JSON.parse(req.body.immagini_esistenti_ids || '[]') : [];
        const documentiDaMantenereIds = req.body.documenti_esistenti_ids ? JSON.parse(req.body.documenti_esistenti_ids || '[]') : [];


        // 1. Eliminare immagini non più presenti
        const immaginiAttuali = await ArticoloImmagini.findAll({ where: { articolo_id: id }, transaction });
        for (const img of immaginiAttuali) {
            if (!immaginiDaMantenereIds.includes(img.id.toString())) { // Assicurati che il confronto sia corretto (stringa vs numero)
                // fs.unlinkSync(path.join(__dirname, '..', '..', img.image_url)); // Elimina file fisico
                // await img.destroy({ transaction }); // Elimina record dal DB
                console.log(`Placeholder: Dovrebbe eliminare l'immagine ${img.image_url}`);
            }
        }
        // 2. Eliminare documenti non più presenti
        const documentiAttuali = await ArticoloDocumenti.findAll({ where: { articolo_id: id }, transaction });
        for (const doc of documentiAttuali) {
            if (!documentiDaMantenereIds.includes(doc.id.toString())) {
                // fs.unlinkSync(path.join(__dirname, '..', '..', doc.document_url)); // Elimina file fisico
                // await doc.destroy({ transaction }); // Elimina record dal DB
                console.log(`Placeholder: Dovrebbe eliminare il documento ${doc.document_url}`);
            }
        }


        await articolo.update({
            nome, descrizione, categoria_id, posizione_id, quantita, prezzo_acquisto,
            data_acquisto: data_acquisto || null,
            valore_stimato, luogo_acquisto,
            garanzia_scadenza: garanzia_scadenza || null,
            note, codice_barre
        }, { transaction });

        const nuoveImmagini = req.files && req.files.nuove_immagini ? req.files.nuove_immagini : [];
        const nuoviDocumenti = req.files && req.files.nuovi_documenti ? req.files.nuovi_documenti : [];

        await handleFileUploads(id, nuoveImmagini, 'immagine', transaction);
        await handleFileUploads(id, nuoviDocumenti, 'documento', transaction);

        await transaction.commit();
        const articoloAggiornato = await Articoli.findByPk(id, {
            include: ['categoria', 'posizione', 'immagini', 'documenti']
        });
        res.status(200).json({ message: "Articolo aggiornato con successo.", articolo: articoloAggiornato });

    } catch (error) {
        await transaction.rollback();
        // Gestione file orfani se necessario
        console.error(`Errore aggiornamento articolo id=${id}:`, error);
        res.status(500).json({ error: "Errore durante l'aggiornamento dell'articolo.", details: error.message });
    }
};


// Elimina un articolo
exports.delete = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const id = req.params.id;
    const articolo = await Articoli.findByPk(id, {
      include: ['immagini', 'documenti'], // Per poter eliminare i file associati
      transaction
    });

    if (!articolo) {
      await transaction.rollback();
      return res.status(404).json({ error: `Articolo con id=${id} non trovato.` });
    }

    // Eliminare file fisici associati (immagini e documenti)
    // Questa parte va gestita con attenzione, specialmente in produzione con storage cloud.
    // Per lo storage locale:
    // if (articolo.immagini) {
    //   articolo.immagini.forEach(img => {
    //     if (img.image_url) {
    //       const filePath = path.join(__dirname, '..', '..', img.image_url); // Costruisci il percorso assoluto
    //       if (fs.existsSync(filePath)) {
    //         fs.unlink(filePath, err => {
    //           if (err) console.error("Errore eliminazione file immagine:", filePath, err);
    //         });
    //       }
    //     }
    //   });
    // }
    // if (articolo.documenti) {
    //   articolo.documenti.forEach(doc => {
    //     if (doc.document_url) {
    //       const filePath = path.join(__dirname, '..', '..', doc.document_url);
    //       if (fs.existsSync(filePath)) {
    //         fs.unlink(filePath, err => {
    //           if (err) console.error("Errore eliminazione file documento:", filePath, err);
    //         });
    //       }
    //     }
    //   });
    // }
    console.log("Placeholder: Logica di eliminazione file fisici da implementare qui.");


    // L'eliminazione dei record ArticoloImmagini e ArticoloDocumenti
    // avverrà automaticamente grazie a onDelete: 'CASCADE' nelle associazioni del modello Articoli.
    const numDeleted = await Articoli.destroy({
      where: { id: id },
      transaction
    });

    await transaction.commit();

    if (numDeleted === 1) {
      res.status(200).json({ message: "Articolo e file associati eliminati con successo." });
    } else {
      // Questo non dovrebbe accadere se findByPk ha trovato l'articolo
      await transaction.rollback(); // Assicurati di fare rollback se qualcosa va storto dopo il findByPk
      res.status(404).json({ error: `Impossibile eliminare l'Articolo con id=${id}.` });
    }
  } catch (error) {
    await transaction.rollback();
    console.error(`Errore eliminazione articolo id=${req.params.id}:`, error);
    res.status(500).json({ error: "Errore durante l'eliminazione dell'articolo." });
  }
};

// Controller per eliminare una singola immagine
exports.deleteImmagine = async (req, res) => {
    const { articoloId, immagineId } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const immagine = await ArticoloImmagini.findOne({
            where: { id: immagineId, articolo_id: articoloId },
            transaction
        });

        if (!immagine) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Immagine non trovata o non associata a questo articolo.' });
        }

        // const imagePath = path.join(__dirname, '..', '..', immagine.image_url);
        // if (fs.existsSync(imagePath)) {
        //     fs.unlinkSync(imagePath);
        // }
        console.log(`Placeholder: Dovrebbe eliminare l'immagine fisica ${immagine.image_url}`);


        await immagine.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Immagine eliminata con successo.' });
    } catch (error) {
        await transaction.rollback();
        console.error('Errore eliminazione immagine:', error);
        res.status(500).json({ error: "Errore durante l'eliminazione dell'immagine." });
    }
};

// Controller per eliminare un singolo documento
exports.deleteDocumento = async (req, res) => {
    const { articoloId, documentoId } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const documento = await ArticoloDocumenti.findOne({
            where: { id: documentoId, articolo_id: articoloId },
            transaction
        });

        if (!documento) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Documento non trovato o non associato a questo articolo.' });
        }

        // const documentPath = path.join(__dirname, '..', '..', documento.document_url);
        // if (fs.existsSync(documentPath)) {
        //     fs.unlinkSync(documentPath);
        // }
        console.log(`Placeholder: Dovrebbe eliminare il documento fisico ${documento.document_url}`);

        await documento.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Documento eliminato con successo.' });
    } catch (error) {
        await transaction.rollback();
        console.error('Errore eliminazione documento:', error);
        res.status(500).json({ error: "Errore durante l'eliminazione del documento." });
    }
};
