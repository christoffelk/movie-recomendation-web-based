const { check, validationResult } = require('express-validator');
const { EXPIRED_TOKEN, SYSTEM_ERROR, VALIDATION_ERROR, GENERAL_ERROR } = require('../constants/errorCode');
const { OK, INTERNAL_ERROR, UNAUTHORIZED, BAD_REQUEST } = require('../constants/responseCode');
const { User, RoleAccess } = require('../models');
const { errorResponse, successResponse } = require('../utils/helper');
const { MODULES, ACCESSTYPE } = require('../constants/general');
const { adminAuthentication } = require('./userMiddleware');
const { allowAccess } = require('../middlewares/RoleAccessMiddleware');


const validationProduct = [
    check('productName').notEmpty().withMessage('Nama produk tidak boleh kosong'),
    check('description').notEmpty().withMessage('Deskripsi produk tidak boleh kosong')
];

const validatoinProductDetail = [
    check('productDetails').notEmpty().withMessage('Harga produk tidak boleh kosong').isArray().withMessage('Detail produk harus berupa array').custom(productDetails => {
        productDetails.forEach(async detail => {
            await check(detail['price']).notEmpty().withMessage('Harga produk tidak boleh kosong').isNumeric().withMessage('Harga produk harus berupa angka');
            await check(detail['stock']).notEmpty().withMessage('Stpk produk tidak boleh kosong').isNumeric().withMessage('Stok produk harus berupa angka');
            await check(detail['discount']).notEmpty().withMessage('Diskon produk tidak boleh kosong').isNumeric().withMessage('Diskon produk harus berupa angka');
            await check(detail['weight']).notEmpty().withMessage('Berat produk tidak boleh kosong').isNumeric().withMessage('Berat produk harus berupa angka');
        });
    })
];

const validationAddProduct = [
    adminAuthentication,
    allowAccess(MODULES['MODULE_PRODUCT'],ACCESSTYPE['insert']),
    ...validationInput,
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


const validationUpdateProduct = [
    adminAuthentication,
    allowAccess(MODULES['MODULE_PRODUCT'],ACCESSTYPE['update']),
    ...validationInput,
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

const validationDeleteProduct = [
    adminAuthentication,
    allowAccess(MODULES['MODULE_PRODUCT'],ACCESSTYPE['delete']),
]

const validationGetProduct = [
    adminAuthentication,
    allowAccess(MODULES['MODULE_PRODUCT'],ACCESSTYPE['select']),
]

module.exports = {
    validationAddProduct,
    validationUpdateProduct,
    validationDeleteProduct,
    validationGetProduct
}