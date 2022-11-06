'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Module.init({
    ModuleId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ModuleName: {
      type: DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: 'Module',
  });
  return Module;
};