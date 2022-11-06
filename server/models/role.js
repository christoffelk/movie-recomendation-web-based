'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.User,{
        foreignKey:'RoleId'
      });
    }
  }
  Role.init({
    RoleId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    Level: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    RoleName:{
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Role',
  });
  return Role;
};