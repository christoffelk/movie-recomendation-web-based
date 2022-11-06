const router = require('express').Router(); 
const { authentication } = require('../middlewares/userMiddleware');
const { validationRating } = require('../middlewares/ratingMiddleware');
const { ratingMovie, getRatedMovieByUser } = require('../controller/rating');

router.post('/:movieId', [authentication, ...validationRating], ratingMovie);
router.get('/', authentication, getRatedMovieByUser);

module.exports = router;