'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleAccess extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RoleAccess.init({
    RoleAccessId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    RoleId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    ModuleId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    AllowSelect: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    AllowInsert: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    AllowUpdate: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    AllowDelete: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: 'RoleAccess',
  });
  return RoleAccess;
};