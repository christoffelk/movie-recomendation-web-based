'use strict';
const fs = require('fs');
const axios = require('axios');
require('dotenv').config({ path: process.cwd()+'/.env'});
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rawdata = fs.readFileSync(process.cwd()+'/assets/links4.csv').toString();
    const data = rawdata.split('\r\n');
    let moviesData = [];
    let index = 0;
    let skipped = 0;
    for(let i=0; i<data.length ;i++){
      const splited = data[i].split(',');
      const movieId = splited[0];
      const imdbId = splited[1]; 
      const tmdbid = splited[2];      
      if(tmdbid){
        const apiUrl = process.env.API_TMDB_URL+'find/tt'+imdbId+'?api_key='+process.env.API_KEY_TMDB+'&external_source=imdb_id';

        const movie = await axios.get(apiUrl);
        if(movie.data.movie_results.length > 0){
          console.log(movieId);
          let resultData = movie.data.movie_results[0];

          if(!resultData['release_date']){
            resultData = movie.data.tv_results[0];
            resultData['title'] = resultData['original_name'];
            resultData['release_date'] = resultData['first_air_date'];
          }
          
          moviesData.push({
            MovieId: movieId,
            Title: resultData['title'],
            ReleaseDate: resultData['release_date'],
            Description: resultData['overview'],
            ImageFileName: resultData['poster_path'] ? resultData['poster_path'] : 'notfound.jpg',
            Genres: resultData['genre_ids'].length > 0 ? resultData['genre_ids'] : null,
            Popularity: resultData['popularity'],
            createdBy: 1,
            createdAt: '2022-11-07 23:39:23.368+07',
            updatedAt: '2022-11-07 23:39:23.368+07'
          });
          index++;
          if(moviesData.length % 50 == 0){
            queryInterface.bulkInsert('Movies', moviesData);
            //reset
            moviesData = [];
            index = 0;
          }
        }
      }else{
        console.log('skipped movieId',movieId);
      }
    }
    return  queryInterface.bulkInsert('Movies', moviesData);
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
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
