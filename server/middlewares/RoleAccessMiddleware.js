const { EXPIRED_TOKEN, SYSTEM_ERROR, VALIDATION_ERROR, GENERAL_ERROR } = require('../constants/errorCode');
const { OK, INTERNAL_ERROR, UNAUTHORIZED, BAD_REQUEST } = require('../constants/responseCode');
const { MODULES } = require('../constants/general');
const { errorResponse, successResponse } = require('../utils/helper'); 

const allowAccess = async (moduleId, typeAccess) => ( async (req, res, next) => {
    try {
        const access = await RoleAccess.findOne({
            where: {
                ModuleId: moduleId,
                UserId: req.userId
            },
            attributes: [typeAccess]
        });

        if(!access[typeAccess]){
            return res.status(UNAUTHORIZED).json(successResponse(GENERAL_ERROR, "Your role cannot access this module",{}));
        }

        next();

    } catch (err) {
        console.log(err);
        return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
});

module.exports = { allowAccess };