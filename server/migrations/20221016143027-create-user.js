'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      UserId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      RoleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      FirstName:{
        type: Sequelize.STRING(50)
      },
      LastName: {
        type: Sequelize.STRING(50)
      },
      Email: {
        type: Sequelize.STRING(50),
        unique : true,
        allowNull: false
      },
      UserName: {
        type: Sequelize.STRING(50),
      },
      Password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      BirthDate:{
        type: Sequelize.DATE
      },
      Gender: {
        type: Sequelize.STRING(10)
      },
      Suspended: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      EmailVerified:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};