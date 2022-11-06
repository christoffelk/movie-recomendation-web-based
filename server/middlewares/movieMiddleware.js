const { check, validationResult } = require('express-validator');
const { EXPIRED_TOKEN, SYSTEM_ERROR, VALIDATION_ERROR, GENERAL_ERROR } = require('../constants/errorCode');
const { OK, INTERNAL_ERROR, UNAUTHORIZED, BAD_REQUEST } = require('../constants/responseCode');
const { User, RoleAccess } = require('../models');
const { errorResponse, successResponse } = require('../utils/helper');
const jwt = require('jsonwebtoken');
const { MODULES, ACCESSTYPE } = require('../constants/general');
const { adminAuthentication, authentication } = require('./userMiddleware');

const validationDataMovie = [
    check('title').notEmpty().withMessage('Judul film tidak boleh kosong'),
    check('year').notEmpty().withMessage('Tahun film tidak boleh kosong').isNumeric().withMessage('Tahun hanya boleh berupa angka'),
    check('imgUrl').isURL().withMessage('Url gambar tidak valid')
]

const validationAddMovie = [
    ...validationDataMovie,
    (req, res, next) => {
        try {
            const validationError = validationResult(req).array({ onlyFirstError : true });
            if(validationError.length){
                return res.status(BAD_REQUEST).json(errorResponse(VALIDATION_ERROR,'',validationError));
            }
            
            next();
        } catch (error) {
            console.log(err);
            res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
        }
    }

];

const validationUpdateMovie = [
    ...validationDataMovie,
    (req, res, next) => {
        try {
            const validationError = validationResult(req).array({ onlyFirstError : true });
            if(validationError.length){
                return res.status(BAD_REQUEST).json(errorResponse(VALIDATION_ERROR,'',validationError));
            }
            
            next();
        } catch (error) {
            console.log(err);
            res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
        }
    }
];


module.exports = {
    validationAddMovie,
    validationUpdateMovie
}