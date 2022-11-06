'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RoleAccesses', {
      RoleAccessId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      RoleId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ModuleId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      AllowSelect: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      AllowInsert: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      AllowUpdate: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      AllowDelete: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RoleAccesses');
  }
};