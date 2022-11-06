const { EXPIRED_TOKEN, SYSTEM_ERROR, VALIDATION_ERROR, GENERAL_ERROR } = require('../constants/errorCode');
const { OK, INTERNAL_ERROR, UNAUTHORIZED, BAD_REQUEST } = require('../constants/responseCode');
const { MODULES, ACCESSTYPE } = require('../constants/general');
const { errorResponse, successResponse } = require('../utils/helper'); 
const { allowAccess } = require('../middlewares/RoleAccessMiddleware');
const { check } = require('express-validator');
const { adminAuthentication } = require('../middlewares/userMiddleware');


const validationAddandUpdateModule = [
    adminAuthentication,
    check('moduleName').notEmpty().withMessage('Nama modul tidak boleh kosong'),
    (req, res, next) => {
        try{
            const validationError = validationResult(req).array({ onlyFirstError : true });
            if(validationError.length){
                res.status(BAD_REQUEST).json(errorResponse(VALIDATION_ERROR,'',validationError));
            }else{
                next();
            }
        }
        catch(err){
            console.log(err);
            res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
        }
}]

module.exports = { validationAddandUpdateModule };