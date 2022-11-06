const { Movie, Rating } = require('../models');
const { GENERAL_ERROR, NO_ERROR, SYSTEM_ERROR } = require("../constants/errorCode");
const { OK, CREATED, INTERNAL_ERROR, NOT_FOUND } = require('../constants/responseCode');
const { successResponse, errorResponse } = require("../utils/helper");


const ratingMovie = async (req, res) => {
    try {   
        const movieId = req.params.movieId;
        const userId = req.user.UserId;
        const { rating }= req.body;

        const movie = await Movie.findByPk(movieId);

        if(!movie){
            return res.status(NOT_FOUND).json(successResponse(NO_ERROR,"Film tidak ditemukan",{}));
        }

        //check if already rated
        const ratedByUser = await Rating.findOne({
            where: {
                UserId: userId,
                MovieId: movieId
            }
        });

        if(!ratedByUser){
            const data = await Rating.create({
                UserId: userId,
                MovieId : movieId,
                Rating: rating
            });
        }else{
            await Rating.destroy({
                where : { 
                    UserId: userId,
                    MovieId : movieId
                }
            });
        }
        
        return res.status(OK).json(successResponse(NO_ERROR,"",{}));
    } catch(err) {
        console.log(err);
        res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}

const getRatedMovieByUser = async (req, res) => {
    try {
        const userId = req.user.UserId;

        const ratings = await Rating.findAll({
            where: {
                UserId: userId
            }
        });

        return res.status(OK).json(successResponse(NO_ERROR,"Berhasil mendapatkan rating", ratings));
    } catch (err) {
        console.log(err);
        res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}

module.exports = { ratingMovie, getRatedMovieByUser }