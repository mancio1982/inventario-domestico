// backend/src/models/categorie.model.js
module.exports = (sequelize, DataTypes) => {
  const Categorie = sequelize.define('Categorie', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
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
    tableName: 'categorie', // Nome esplicito della tabella
    timestamps: true, // Sequelize gestirà createdAt e updatedAt
    createdAt: 'data_creazione',
    updatedAt: 'data_aggiornamento',
    hooks: { // Per coerenza con lo schema SQL che usa i trigger
        beforeUpdate: (categoria) => {
            categoria.data_aggiornamento = new Date();
        }
    }
  });

  Categorie.associate = (models) => {
    // Una Categoria può avere molte Posizioni
    Categorie.hasMany(models.Posizioni, {
      foreignKey: 'categoria_id',
      as: 'posizioni', // Alias per l'associazione
    });
    // Una Categoria può avere molti Articoli
    Categorie.hasMany(models.Articoli, {
      foreignKey: 'categoria_id',
      as: 'articoli',
    });
  };

  return Categorie;
};
