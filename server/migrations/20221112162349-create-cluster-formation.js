'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ClusterFormations', {
      ClusterFormationId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      Cluster: {
        allowNull: false,
        type: Sequelize.SMALLINT
      },
      Value: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });


    await queryInterface.addIndex('ClusterFormations',['UserId','Cluster']);
    await queryInterface.addIndex('ClusterFormations',['UserId']);
    await queryInterface.addIndex('ClusterFormations',['Cluster']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ClusterFormations');
  }
};