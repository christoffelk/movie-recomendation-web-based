'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClusterFormation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ClusterFormation.init({
    ClusterFormationId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      indexes:[
        {
          unique: false,
          fields:['ownerId']
        }
      ]
    },
    Cluster: {
      allowNull: false,
      type: DataTypes.SMALLINT,
      indexes:[
        {
          unique: false,
          fields:['ownerId']
        }
      ]
    },
    Value: {
      allowNull: false,
      type: DataTypes.DOUBLE
    }
  }, {
    sequelize,
    createdAt: true,
    updatedAt: false,
    indexes:[
      {
        unique: false,
        fields:['UserId']
      },
      {
        unique: false,
        fields:['Cluster']
      }
    ],
    modelName: 'ClusterFormation',
  });
  return ClusterFormation;
};