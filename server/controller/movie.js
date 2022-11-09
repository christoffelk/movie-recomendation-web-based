const { Movie, Upload } = require('../models');
const { GENERAL_ERROR, NO_ERROR, SYSTEM_ERROR } = require("../constants/errorCode");
const { OK, CREATED, INTERNAL_ERROR, NOT_FOUND, BAD_REQUEST } = require('../constants/responseCode');
const { successResponse, errorResponse, upload } = require("../utils/helper");
const multer = require('multer');


const addMovie = async (req, res) => {
    try {
        const { title, year, imgUrl, description} = req.body;
        
        const dataInsert = {
            Title: title,
            Year: year,
            ImgUrl: imgUrl,
            Description: description,
            createdBy: req.userId
        };

        const data = await Movie.create(dataInsert);
        
        return res.status(CREATED).json(successResponse(NO_ERROR,"Berhasil menambah film",{}));
    } catch (err) {
        console.log(err);
        res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}

const uploadImage = async(req, res) => {
    try{
        console.log(req.body);
        const uploadedImage = upload('image',process.env.IMAGE_PATH,'.jpeg');
        uploadedImage(req, res, async (err) => {
            if(err instanceof multer.MulterError || err){
                return res.status(BAD_REQUEST).json(errorResponse(GENERAL_ERROR, err.message, err));
            }
        });

        const data = await Upload.create({
            FileName: req.body.filename,
            UploadedBy: req.user.UserId
        });

        res.status(OK).json(successResponse(NO_ERROR,"Berhasil upload gambar", data));
    }
    catch(err){
        console.log(err);
        res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}

const updateMovie = async (req, res) => {
    try {
        const { title, year, imgUrl, description} = req.body;
        const movieId = req.params.movieId;

        //check movie exist
        const movie = await Movie.findByPk(movieId);

        if(!movie){
            return res.status(NOT_FOUND).json(successResponse(NO_ERROR,"Film tidak ditemukan",{}));
        }

        const dataUpdate = {
            Title: title,
            Year: year,
            ImgUrl: imgUrl,
            Description: description,
            updatedBy: req.userId
        };

        const data = await Movie.update(dataUpdate,{
            where: {
                MovieId: movieId
            }
        });
        
        return res.status(OK).json(successResponse(NO_ERROR,"Berhasil memperbarui film",{}));
    } catch (err) {
        console.log(err);
        res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}

const deleteMovie = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        
        //check movie exist
        const movie = await Movie.findByPk(movieId);

        if(!movie){
            return res.status(NOT_FOUND).json(successResponse(NO_ERROR,"Film tidak ditemukan",{}));
        }

        await Movie.destroy({
            where: {
                MovieId: movieId
            }
        });

        return res.status(OK).json(successResponse(NO_ERROR,"Berhasil menghapus film",{}));
    } catch (err) {
        console.log(err);
        res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}

const getAllMovies = async (req, res) => {
    try {
        
        let { page, limit } = req.params;

        if(!limit || limit >= 100){
            limit = 100;
        }

        if(!page || page < 1){
            page = 1;
        };

        const movies = await Movie.findAll({
            offset: (page * limit) - limit + 1,
            limit: limit,
            attributes: ['MovieId','Title','Year','ImgUrl','Description']
        });
        return res.status(OK).json(successResponse(NO_ERROR,"Berhasil mendapatkan film",movies));
    } catch (err) {
        console.log(err);
        res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}

const getMovieById = async (req, res) => {
    try {
        const movieId = req.params.movieId;

        const movie = await Movie.findByPk(movieId,{
            attributes:['Title','Year','ImgUrl','Description']
        });
        
        return res.status(OK).json(successResponse(NO_ERROR,"Berhasil mendapatkan film",movie));
    } catch (err) {
        console.log(err);
        res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}


module.exports = {
    addMovie,
    updateMovie,
    deleteMovie,
    getAllMovies,
    getMovieById,
    uploadImage
}