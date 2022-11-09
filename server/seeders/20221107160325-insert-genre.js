'use strict';
const axios = require('axios');
require('dotenv').config({ path: `${process.cwd()}/.env`});
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const lang = 'en-US';
    const apiUrl = process.env.API_TMDB_URL+'genre/movie/list?api_key='+process.env.API_KEY_TMDB+'&language='+lang;
    const genres = await axios.get(apiUrl);
    const insertData = [];
    genres.data.genres.forEach((genre,i) => {
      insertData.push({
        GenreId: genre['id'],
        GenreName: genre['name']
      });
    });

    await queryInterface.bulkInsert('Genres', insertData);
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
    await queryInterface.bulkDelete('Genres', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
