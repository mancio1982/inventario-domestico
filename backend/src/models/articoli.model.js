// backend/src/models/articoli.model.js
module.exports = (sequelize, DataTypes) => {
  const Articoli = sequelize.define('Articoli', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    descrizione: {
      type: DataTypes.TEXT,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categorie',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    posizione_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Posizioni',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    quantita: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    prezzo_acquisto: {
      type: DataTypes.DECIMAL(10, 2),
    },
    data_acquisto: {
      type: DataTypes.DATEONLY, // Solo data, senza ora
    },
    valore_stimato: {
      type: DataTypes.DECIMAL(10, 2),
    },
    luogo_acquisto: {
      type: DataTypes.TEXT,
    },
    garanzia_scadenza: {
      type: DataTypes.DATEONLY,
    },
    note: {
      type: DataTypes.TEXT,
    },
    codice_barre: {
      type: DataTypes.TEXT,
    },
    data_creazione: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    data_aggiornamento: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'articoli',
    timestamps: true,
    createdAt: 'data_creazione',
    updatedAt: 'data_aggiornamento',
    hooks: {
        beforeUpdate: (articolo) => {
            articolo.data_aggiornamento = new Date();
        }
    }
  });

  Articoli.associate = (models) => {
    Articoli.belongsTo(models.Categorie, {
      foreignKey: 'categoria_id',
      as: 'categoria',
    });
    Articoli.belongsTo(models.Posizioni, {
      foreignKey: 'posizione_id',
      as: 'posizione',
    });
    Articoli.hasMany(models.ArticoloImmagini, {
      foreignKey: 'articolo_id',
      as: 'immagini',
      onDelete: 'CASCADE', // Se un articolo viene eliminato, elimina anche le sue immagini
    });
    Articoli.hasMany(models.ArticoloDocumenti, {
      foreignKey: 'articolo_id',
      as: 'documenti',
      onDelete: 'CASCADE', // Se un articolo viene eliminato, elimina anche i suoi documenti
    });
  };

  return Articoli;
};
