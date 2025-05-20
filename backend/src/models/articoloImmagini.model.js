// backend/src/models/articoloImmagini.model.js
module.exports = (sequelize, DataTypes) => {
  const ArticoloImmagini = sequelize.define('Articolo_Immagini', { // Nome modello singolare, Sequelize pluralizza per la tabella se non specificato in tableName
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    articolo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Articoli',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    descrizione_immagine: {
        type: DataTypes.TEXT,
    },
    data_caricamento: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'articolo_immagini', // Coerente con schema.sql
    timestamps: false, // Gestiamo solo data_caricamento
  });

  ArticoloImmagini.associate = (models) => {
    ArticoloImmagini.belongsTo(models.Articoli, {
      foreignKey: 'articolo_id',
      as: 'articolo',
    });
  };

  return ArticoloImmagini;
};
