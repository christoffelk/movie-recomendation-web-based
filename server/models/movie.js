'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  movie.init({
    MovieId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    Year: {
      allowNull: false,
      type: DataTypes.STRING
    },
    ImgUrl: {
      allowNull: false,
      type: DataTypes.STRING
    },
    Description: DataTypes.STRING,
    createdBy: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    updatedBy: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return movie;
};