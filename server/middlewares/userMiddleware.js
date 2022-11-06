const { check, validationResult, body } = require('express-validator');
const { EXPIRED_TOKEN, SYSTEM_ERROR, VALIDATION_ERROR, GENERAL_ERROR } = require('../constants/errorCode');
const { OK, INTERNAL_ERROR, UNAUTHORIZED, BAD_REQUEST } = require('../constants/responseCode');
const { User, Role } = require('../models');
const { errorResponse, successResponse } = require('../utils/helper');
const { allowAccess } = require('../middlewares/RoleAccessMiddleware');
const jwt = require('jsonwebtoken');
const { MODULES, ACCESSTYPE, ROLES, ROLE_USER } = require('../constants/general');

const validationSignIn = [
    check('email').normalizeEmail()
    .notEmpty().withMessage("Email cannot be empty")
    .isEmail().withMessage("Email format is wrong"),
    check('password')
    .isLength({ min : 8 }).withMessage("Password required at least 8 characters"),

    (req, res, next) => {
        try{
            const validationError = validationResult(req).array({ onlyFirstError : true});
            if(validationError.length){
                res.status(BAD_REQUEST).json(errorResponse(VALIDATION_ERROR,'',validationError));
            }
            else{
                next();
            }
        }
        catch(err){
            console.log(err);
            res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '',{}));
        }
}]

const validationSignUp = [
    check('userName').isLength({ max : 50 }).withMessage("Maksimal hanya 50 karakter"),
    check('email').notEmpty().withMessage("Email cannot be empty").isEmail().withMessage("Email format is wrong"),
    check('password')
    .isLength({ min : 8 }).withMessage("Password required at least 8 characters"),
    check('confirmPassword')
    .notEmpty().custom((value,{ req }) => {
        if(value != req.body.password){
            throw new Error("Confirm password does not match with password");
        }
        return true;
    }),(req, res, next) => {
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


const authentication = async (req, res, next) => {
    try{
        let token = req.headers.authorization;
        if(token){
            token = token.split(" ")[1];
            const decodedData = jwt.verify(token,process.env.SECRET_USER_KEY);
            req.userId = decodedData?.id;
            const user = await User.findOne({
                where:{ 
                    UserId: req.userId
                }
            });

            if(!user || user.RoleId != ROLE_USER) {
                return res.status(UNAUTHORIZED).json(errorResponse(GENERAL_ERROR,"",{}));
            }

            req.user = user;

            next();
        }
        else{
            res.status(BAD_REQUEST).json(errorResponse(SYSTEM_ERROR, "Your Authentication is not valid", {}));    
        }
    }
    catch(err){
        console.log(err);
        res.status(UNAUTHORIZED).json(errorResponse(EXPIRED_TOKEN, '', {}));
    }
}

const validationChangePassword = [
    authentication,
    check('oldPassword').isLength({ min : 8 }).withMessage("Password required at least 8 characters"),
    check('newPassword').isLength({ min : 8 }).withMessage("Password required at least 8 characters"),
    check('confirmNewPassword').isLength({ min : 8 }).withMessage("Password required at least 8 characters")
    .custom((value,{ req }) => {
        if(value != req.body.newPassword){
            throw new Error("Confirm new password does not match with new password");
        }

        return true;
    }),
    (req, res, next) => {
        try{
            const validationError = validationResult(req).array({ onlyFirstError : true });
            if(validationError.length){
                return res.status(BAD_REQUEST).json(errorResponse(VALIDATION_ERROR,'',validationError));
            }
            
            next();
        }
        catch(err){
            console.log(err);
            return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
        }
    }
];

const adminAuthentication = async (req, res, next) => {
    try{
        let token = req.headers.authorization;
        if(token){
            token = token.split(" ")[1];
            const decodedData = jwt.verify(token,process.env.SECRET_ADMIN_KEY);
            
            req.userId = decodedData?.id;
            const user = await User.findByPk(req.userId);
            
            if(!user || user.RoleId == ROLE_USER) {
                return res.status(UNAUTHORIZED).json(errorResponse(GENERAL_ERROR,"",{}));
            }

            const role = await Role.findOne({
                where: {
                    RoleId : user.RoleId
                }
            })
            req.role = role;

            next();
        }
        else{
            res.status(BAD_REQUEST).json(errorResponse(SYSTEM_ERROR, "Your Authentication is not valid", {}));    
        }
    }
    catch(err){
        console.log(err);
        res.status(UNAUTHORIZED).json(errorResponse(EXPIRED_TOKEN, '', {}));
    }
}

const validationAdminLogin = [
    check('userName').trim().notEmpty().withMessage('Username tidak boleh kosong'),
    check('password').notEmpty().withMessage('Password tidak boleh kosong'),
    (req, res, next) => {
        try{
            const validationError = validationResult(req).array({ onlyFirstError : true });
            if(validationError.length){
                return res.status(BAD_REQUEST).json(errorResponse(VALIDATION_ERROR,'',validationError));
            }
            
            next();
        }
        catch(err){
            console.log(err);
            return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
        }
    }
]


const validationAddUser = [
    check('firstName').isLength({max: 50}).withMessage("Maksimal hanya 50 karakter"),
    check('lastName').isLength({max: 50}).withMessage("Maksimal hanya 50 karakter"),
    check('userName').isLength({ max : 50 }).withMessage("Maksimal hanya 50 karakter"),
    check('email').notEmpty().withMessage("Email cannot be empty").isEmail().withMessage("Email format is wrong"),
    check('suspended').notEmpty().withMessage('Suspend tidak boleh kosong').isBoolean().withMessage('Suspended harus berupa boolean'),
    check('roleId').notEmpty().withMessage('Role tidak boleh kosong').isNumeric().withMessage('RoleId harus berupa angka'),
    check('birthDate').if(body('birthDate').exists()).isDate().withMessage('Format tanggal lahir harus YY-mm-dd'),
    check('gender').if(body('gender').exists()).isAlpha().withMessage('Hanya berupa alphabet'),
    check('password')
    .isLength({ min : 8 }).withMessage("Password required at least 8 characters"),
    check('confirmPassword')
    .notEmpty().custom((value,{ req }) => {
        if(value != req.body.password){
            throw new Error("Confirm password does not match with password");
        }
        return true;
    }),(req, res, next) => {
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


const validationUpdateUser = [
    check('firstName').isLength({max: 50}).withMessage("Maksimal hanya 50 karakter"),
    check('lastName').isLength({max: 50}).withMessage("Maksimal hanya 50 karakter"),
    check('suspended').notEmpty().withMessage('Suspend tidak boleh kosong').isBoolean().withMessage('Suspended harus berupa boolean'),
    check('roleId').notEmpty().withMessage('Role tidak boleh kosong').isNumeric().withMessage('RoleId harus berupa angka'),
    check('birthDate').if(body('birthDate').exists()).isDate().withMessage('Format tanggal lahir harus YY-mm-dd'),
    check('gender').if(body('gender').exists()).isAlpha().withMessage('Hanya berupa alphabet'),
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
    }
];

module.exports = {  
                    authentication, 
                    validationSignIn, 
                    validationSignUp, 
                    validationChangePassword, 
                    adminAuthentication,
                    validationAdminLogin,
                    validationAddUser,
                    validationUpdateUser
                }