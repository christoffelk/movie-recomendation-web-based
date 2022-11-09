'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Genre.init({
    GenreId: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    GenreName: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Genre',
  });
  return Genre;
};