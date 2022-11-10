const express = require('express');
const router = express.Router();
const { adminAuthentication, authentication } = require('../middlewares/userMiddleware');
const { validationAddMovie, validationUpdateMovie, validationGetMovies} = require('../middlewares/movieMiddleware');
const { addMovie, updateMovie, deleteMovie, getAllMovies, getMovieById, uploadImage } = require('../controller/movie');

router.get('/', validationGetMovies ,getAllMovies);
router.get('/:movieId',getMovieById);
router.post('/', [adminAuthentication, ...validationAddMovie], addMovie);
router.put('/:movieId', [adminAuthentication, ...validationUpdateMovie], updateMovie);
router.delete('/:movieId', adminAuthentication, deleteMovie);
router.post('/upload', adminAuthentication, uploadImage);

module.exports = router;