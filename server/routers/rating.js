const router = require('express').Router(); 
const { authentication, adminAuthentication } = require('../middlewares/userMiddleware');
const { validationRating, validationGetRating } = require('../middlewares/ratingMiddleware');
const { ratingMovie, getRatedMovieByUser, getAllRatings } = require('../controller/rating');
const { FCM } = require('../controller/cluster');

router.post('/:movieId', [authentication, ...validationRating], ratingMovie);
router.get('/', authentication, getRatedMovieByUser);
router.get('/getAll',[adminAuthentication, ...validationGetRating], getAllRatings);
router.get('/cluster',FCM);

module.exports = router;