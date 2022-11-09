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
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    Title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    ReleaseDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    ImageFileName: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    Description: {
      type: DataTypes.TEXT
    },
    Genres : {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    Popularity: {
      type: Sequelize.DOUBLE
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    createdBy: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
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