'use strict';
const { ROLES } = require('../constants/general');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const insertedData = [];
    Object.keys(ROLES).forEach((value, index) => {
      insertedData[index] = {
        RoleId : ROLES[value],
        Level: value == 'ADMIN' ? 10 : 1,
        RoleName: value
      }
    });
    await queryInterface.bulkInsert('Roles', insertedData);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
