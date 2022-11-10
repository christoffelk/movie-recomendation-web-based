const { check, query, param, validationResult } = require('express-validator');
const { EXPIRED_TOKEN, SYSTEM_ERROR, VALIDATION_ERROR, GENERAL_ERROR } = require('../constants/errorCode');
const { OK, INTERNAL_ERROR, UNAUTHORIZED, BAD_REQUEST } = require('../constants/responseCode');
const { errorResponse, successResponse } = require('../utils/helper');


const validationRating = [
    check('rating').isFloat().withMessage('Rating hanya bisa berupa angka'),
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

const validationGetRating = [
    query('page').isNumeric().withMessage('Page hanya bisa berupa angka'),
    query('limit').isNumeric().withMessage('Limit hanya bisa berupa angka'),
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
]


module.exports = {
    validationRating,
    validationGetRating
}