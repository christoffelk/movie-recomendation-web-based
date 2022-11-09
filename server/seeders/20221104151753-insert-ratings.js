"use strict";
const fs = require("fs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rawdata = fs.readFileSync(process.cwd()+'/assets/ratings.csv').toString();
    const data = rawdata.split('\r\n');
    let ratingsData = [];
    let index = 0;
    for (let i = 1; i < data.length; i++) {
      const splited = data[i].split(",");
      ratingsData[index] = {
        UserId: parseInt(splited[0]),
        MovieId: parseInt(splited[1]),
        Rating: splited[2],
      };

      index++;
      if (ratingsData.length % 50 == 0) {
        queryInterface.bulkInsert("Ratings", ratingsData);
        //reset
        ratingsData = [];
        index = 0;
      }
    }
    return queryInterface.bulkInsert("Ratings", ratingsData);
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

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Ratings", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
