// backend/src/models/articoloDocumenti.model.js
module.exports = (sequelize, DataTypes) => {
  const ArticoloDocumenti = sequelize.define('Articolo_Documenti', {
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
    document_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    nome_file: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipo_file: {
        type: DataTypes.TEXT,
    },
    dimensione_file: {
        type: DataTypes.INTEGER, // in bytes
    },
    data_caricamento: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'articolo_documenti', // Coerente con schema.sql
    timestamps: false, // Gestiamo solo data_caricamento
  });

  ArticoloDocumenti.associate = (models) => {
    ArticoloDocumenti.belongsTo(models.Articoli, {
      foreignKey: 'articolo_id',
      as: 'articolo',
    });
  };

  return ArticoloDocumenti;
};
