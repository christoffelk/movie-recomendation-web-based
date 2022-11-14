'use strict';
const Role = require('./role');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Role,{
        foreignKey: 'RoleId'
      });
    }
  }
  User.init({
    UserId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    RoleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    FirstName: {
      type: DataTypes.STRING(50)
    },
    LastName: {
      type: DataTypes.STRING(50)
    },
    Email: { 
      type: DataTypes.STRING(50),
      allowNull: false
    },
    UserName: {
      type: DataTypes.STRING(50)
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    EmailVerified:{
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    Suspended: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    BirthDate:{
      type: DataTypes.DATE
    },
    Gender: {
      type: DataTypes.STRING(10)
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};