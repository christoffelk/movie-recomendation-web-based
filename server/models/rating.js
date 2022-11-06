'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  rating.init({
    RatingId:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    UserId: DataTypes.INTEGER,
    MovieId: DataTypes.INTEGER,
    Rating: DataTypes.DOUBLE
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Rating',
  });
  return rating;
};