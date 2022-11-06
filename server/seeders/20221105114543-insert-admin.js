'use strict';
const bcrypt = require('bcryptjs');
const { ROLE_ADMIN } = require('../constants/general');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const password = 'admin123';
    const generateSalt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,generateSalt);

    return  queryInterface.bulkInsert('Users', [{
      Email: 'admin@gmail.com',
      UserName: 'admin',
      Password: hashPassword,
      Suspended: false,
      EmailVerified: true,
      RoleId : ROLE_ADMIN,
      createdAt: '2022-11-05 21:42:23.368+07',
      updatedAt: '2022-11-05 21:42:23.368+07',
    }]);
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
    await queryInterface.destroy({
      where: {
        UserName: 'admin'
      }
    });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
