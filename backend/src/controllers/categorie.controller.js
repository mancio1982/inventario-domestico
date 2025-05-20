// backend/src/controllers/categorie.controller.js
const { Categorie, Posizioni, Articoli } = require('../models'); // Assicurati che Posizioni e Articoli siano importati se usati nelle inclusioni

// Crea una nuova categoria
exports.create = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ error: "Il nome della categoria è obbligatorio." });
    }
    const nuovaCategoria = await Categorie.create({ nome });
    res.status(201).json(nuovaCategoria);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: "Una categoria con questo nome esiste già." });
    }
    console.error("Errore creazione categoria:", error);
    res.status(500).json({ error: "Errore durante la creazione della categoria." });
  }
};

// Recupera tutte le categorie
exports.findAll = async (req, res) => {
  try {
    const categorie = await Categorie.findAll({
        order: [['nome', 'ASC']], // Ordina per nome
        // Esempio di inclusione di modelli associati:
        // include: [{ model: Posizioni, as: 'posizioni' }]
    });
    res.status(200).json(categorie);
  } catch (error) {
    console.error("Errore recupero categorie:", error);
    res.status(500).json({ error: "Errore durante il recupero delle categorie." });
  }
};

// Recupera una singola categoria con id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const categoria = await Categorie.findByPk(id, {
      include: [ // Includi anche le posizioni e gli articoli associati
        { model: Posizioni, as: 'posizioni' },
        { model: Articoli, as: 'articoli' }
      ]
    });
    if (categoria) {
      res.status(200).json(categoria);
    } else {
      res.status(404).json({ error: `Categoria con id=${id} non trovata.` });
    }
  } catch (error) {
    console.error(`Errore recupero categoria id=${req.params.id}:`, error);
    res.status(500).json({ error: "Errore durante il recupero della categoria." });
  }
};

// Aggiorna una categoria con id
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "Il nome della categoria non può essere vuoto per l'aggiornamento." });
    }

    const [numUpdated] = await Categorie.update({ nome }, {
      where: { id: id }
    });

    if (numUpdated === 1) {
      const updatedCategoria = await Categorie.findByPk(id);
      res.status(200).json({ message: "Categoria aggiornata con successo.", categoria: updatedCategoria });
    } else {
      res.status(404).json({ error: `Impossibile aggiornare la Categoria con id=${id}. Forse non è stata trovata o req.body è vuoto.` });
    }
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: "Una categoria con questo nome esiste già." });
    }
    console.error(`Errore aggiornamento categoria id=${req.params.id}:`, error);
    res.status(500).json({ error: "Errore durante l'aggiornamento della categoria." });
  }
};

// Elimina una categoria con id
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    // Opzionale: verifica se ci sono Posizioni o Articoli associati prima di eliminare
    // Se la FK ha ON DELETE RESTRICT, Sequelize genererà un errore che puoi catturare.
    // Se è ON DELETE SET NULL (come nel nostro schema), i riferimenti verranno impostati a NULL.
    // Se è ON DELETE CASCADE, gli elementi collegati verranno eliminati.

    const numDeleted = await Categorie.destroy({
      where: { id: id }
    });

    if (numDeleted === 1) {
      res.status(200).json({ message: "Categoria eliminata con successo." });
    } else {
      res.status(404).json({ error: `Impossibile eliminare la Categoria con id=${id}. Forse non è stata trovata.` });
    }
  } catch (error) {
    // Esempio di gestione errore per foreign key constraint se non si usa SET NULL/CASCADE
    // if (error.name === 'SequelizeForeignKeyConstraintError') {
    //   return res.status(409).json({ error: "Impossibile eliminare la categoria perché ha posizioni o articoli associati." });
    // }
    console.error(`Errore eliminazione categoria id=${req.params.id}:`, error);
    res.status(500).json({ error: "Errore durante l'eliminazione della categoria." });
  }
};
