'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Upload extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Upload.init({
    UploadId: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    FileName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    UploadedBy: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    timestamps:false,
    modelName: 'Upload',
  });
  return Upload;
};