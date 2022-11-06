const { Module } = require('../models');
const { GENERAL_ERROR, NO_ERROR, SYSTEM_ERROR } = require("../constants/errorCode");
const { OK, CREATED, INTERNAL_ERROR, NOT_FOUND } = require('../constants/responseCode');
const { successResponse, errorResponse } = require("../utils/helper");


const addModule = async (req, res) => {
    try {
        const { moduleName } = req.body;

        const module = await Module.create({
            ModuleName: moduleName
        });

        return res.status(CREATED).json(successResponse(NO_ERROR,"Berhasil menambahkan module",{}));

    } catch (err) {
        console.log(err);
        return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '' , {}));
    }
}

const updateModule = async (req, res) => {
    try {
        const moduleId = req.params.moduleId;
        const { moduleName } = req.body;

        const module = await Module.findByPk(moduleId);

        if(!module){
            return res.status(NOT_FOUND).json(errorResponse(GENERAL_ERROR,"Modul tidak ditemukan", {}));
        }

        await Module.update({
            ModuleName: moduleName
        },{
            where: {
                ModuleId: moduleId
            }
        });

        return res.status(OK).json(successResponse(NO_ERROR,"Berhasil memperbarui modul",{}));

    } catch (err) {
        console.log(err);
        return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '' , {}));
    }
}

const deleteModule = async (req, res) => {
    try {
        const moduleId = req.params.moduleId;
        const { moduleName } = req.body;

        const module = await Module.findByPk(moduleId);

        if(!module){
            return res.status(NOT_FOUND).json(errorResponse(GENERAL_ERROR,"Modul tidak ditemukan", {}));
        }

        await Module.destroy({
            where: {
                ModuleId: moduleId
            }
        });

        return res.status(OK).json(successResponse(NO_ERROR,"Berhasil menghapus modul",{}));
    } catch (err) {
        console.log(err);
        return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '' , {}));
    }
}

const getAllModule = async (req, res) => {
    try {
        const modules = await Module.findAll();
        return res.status(OK).json(successResponse(NO_ERROR,"Berhasil mendapatkan data modul",modules));

    } catch (err) {
        console.log(err);
        return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '' , {}));
    }
}


module.exports = { addModule, updateModule, deleteModule, getAllModule };
