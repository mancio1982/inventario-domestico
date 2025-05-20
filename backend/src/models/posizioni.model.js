// backend/src/models/posizioni.model.js
module.exports = (sequelize, DataTypes) => {
  const Posizioni = sequelize.define('Posizioni', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categorie', // Nome del modello referenziato
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Coerente con schema.sql
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
    tableName: 'posizioni',
    timestamps: true,
    createdAt: 'data_creazione',
    updatedAt: 'data_aggiornamento',
    hooks: {
        beforeUpdate: (posizione) => {
            posizione.data_aggiornamento = new Date();
        }
    }
  });

  Posizioni.associate = (models) => {
    // Una Posizione appartiene a una Categoria
    Posizioni.belongsTo(models.Categorie, {
      foreignKey: 'categoria_id',
      as: 'categoria',
    });
    // Una Posizione può avere molti Articoli
    Posizioni.hasMany(models.Articoli, {
      foreignKey: 'posizione_id',
      as: 'articoli',
    });
  };

  return Posizioni;
};
