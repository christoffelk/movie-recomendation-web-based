const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const { User, Role} = require('../models');
const { ROLE_USER, ROLE_ADMIN } = require('../constants/general'); 
const { GENERAL_ERROR, NO_ERROR, SYSTEM_ERROR } = require("../constants/errorCode");
const { OK, CREATED, INTERNAL_ERROR, NOT_FOUND, BAD_REQUEST } = require('../constants/responseCode');
const { successResponse, errorResponse } = require("../utils/helper");

const signIn = async ( req, res ) => {
    const { email, password } = req.body;
    try{

        const user = await User.findOne({ where : { 
            Email : email,
            RoleId: ROLE_USER
        }});
        
        if(!user){
            return res.status(NOT_FOUND).json(errorResponse(GENERAL_ERROR,"Your email or password is wrong",{}));
        }

        const isPasswordCorrect= await bcrypt.compare(password,user.Password);
        if(!isPasswordCorrect){
            return res.status(OK).json(errorResponse(GENERAL_ERROR,"Your email or password is wrong",{}))
        }

        const token = jwt.sign({id: user.UserId},process.env.SECRET_USER_KEY,{expiresIn: '1h'});

        const responseData = {
            token : token
        }

        return res.status(OK).json(successResponse(NO_ERROR, "",responseData));
    }
    catch(err){
        console.log(err);
        return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '' , {}));
    }
}

const signUp = async ( req, res ) => {
    const { userName, email, password } = req.body;
    try{
        const user = await User.findOne({where : {
            Email : email
        }});

        if(user) {
            return res.status(OK).json(errorResponse(GENERAL_ERROR,"Email sudah terdaftar",{}));
        }

        const generateSalt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(password,generateSalt);

        const insertedUser  = await User.create({
            UserName: userName,
            Email: email,
            RoleId: ROLE_USER,
            Password : hashPassword,
            Suspended: false,
            EmailVerified: false
        });

        return res.status(CREATED).json(successResponse(NO_ERROR,"Pendaftaran berhasil",{}));
    }
    catch(err){
        console.log(err);
        return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}

//masih belum tau update apa
const updateUserInfo = (req, res) => {
    const { username, phone} = req.body;
    try {
        
    }
    catch (error) {
        
    }
}


const adminLogin = async (req, res) => {
    const { userName, password } = req.body;
    try{
        const user = await User.findOne({
            where : { 
                UserName : userName,
            }
        });
        
        if(!user || user.RoleId == ROLE_USER){
            return res.status(NOT_FOUND).json(errorResponse(GENERAL_ERROR,"Username atau password yang anda masukkan salah",{}));
        }

        const isPasswordCorrect= await bcrypt.compare(password,user.Password);
        if(!isPasswordCorrect){
            return res.status(OK).json(errorResponse(GENERAL_ERROR,"Username atau password yang anda masukkan salah",{}))
        }

        const token = jwt.sign({id: user.UserId},process.env.SECRET_ADMIN_KEY,{expiresIn: '1h'});

        const responseData = {
            token : token
        }

        return res.status(OK).json(successResponse(NO_ERROR, "",responseData));
    }
    catch(err){
        console.log(err);
        return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '' , {}));
    }
}

const addUser = async (req, res) => {
    const { firstName, lastName, birthDate, gender, userName, email, roleId, suspended, emailVerified, password } = req.body;
    try{
        const user = await User.findOne({where : {
            [Op.or] : [{Email: email},{UserName: userName}]
        }});

        if(user) {
            return res.status(BAD_REQUEST).json(errorResponse(GENERAL_ERROR,"Email atau username sudah terdaftar",{}));
        }

        //check apakah admin ini bisa gk tambah user
        const generateSalt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(password,generateSalt);

        const insertedUser  = await User.create({
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            UserName: userName,
            RoleId: roleId,
            Password : hashPassword,
            Suspended: suspended ? suspended : false,
            EmailVerified: emailVerified ? emailVerified : false ,
            BirthDate: birthDate,
            Gender: gender
        },{
            attributes: ['FirstName','LastName','Email','UserName','RoleId','Suspended','EmailVerified','Gender','BirthDate']
        });

        return res.status(CREATED).json(successResponse(NO_ERROR,"Berhasil menambahkan user", {}));
    }
    catch(err){
        console.log(err);
        return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}

//Harus di catat di log
const updateUser = async (req, res) => {
    const { firstName, lastName, birthDate, gender, roleId, suspended, emailVerified } = req.body;
    const userId = req.params.userId;
    try{

        await User.update({
            FirstName: firstName,
            LastName: lastName,
            BirthDate: birthDate,
            Gender: gender,
            RoleId: roleId,
            Suspended: suspended,
            EmailVerified: emailVerified,
        },{
            where: {
                UserId: userId
            }
        });

        return res.status(OK).json(successResponse(NO_ERROR,"Berhasil memperbarui user", {}));
    }
    catch(err){
        console.log(err);
        return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}

//Harus di catat di log
const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    try{
        //check user exist
        const user = await User.findByPk(userId);
        const targetRole = await Role.findByPk(user.RoleId);
        if(!user){
            return res.status(NOT_FOUND).json(errorResponse(GENERAL_ERROR,"User tidak ditemukan",{}));
        }

        if(targetRole.Level >= req.role.Level){
            return res.status(BAD_REQUEST).json(errorResponse(GENERAL_ERROR,"Anda tidak diperbolehkan untuk menghapus user ini",{}));
        }

        await User.destroy({
            where: {
                UserId: userId
            }
        });

        return res.status(OK).json(successResponse(NO_ERROR,"Berhasil menghapus user", {}));
    }
    catch(err){
        console.log(err);
        return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}

const getAllUser = async (req, res) => {
    try {
        const roleAdminLevel = req.role.Level;
        const users = await User.findAll({
            include: [
                {
                    model: Role,
                    where: {
                        Level : {
                            [Op.lte]: roleAdminLevel
                        }
                    }  
                },
            ],
            attributes: ['UserId','Email','FirstName','LastName','UserName','BirthDate','Gender','Suspended','EmailVerified','RoleId']
        });

        return res.status(OK).json(successResponse(NO_ERROR,"Berhasil mendapatkan user",users));
    } catch (err) {
        console.log(err);
        return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({
            where:{
                UserId: userId,
            },
            include: [
                {
                    module: 'Roles',
                    where: {
                        Level : {
                            [Op.lte]: roleAdminLevel
                        }
                    }  
                },
            ],
            attributes: ['UserId','FirstName','LastName','BirthDate','Gender','Email','UserName','Suspended','EmailVerified','RoleId']
        });
        
        return res.status(OK).json(successResponse(NO_ERROR,"Berhasil mendapatkan user",user));
    } catch (err) {
        console.log(err);
        return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}

const changePassword = async (req, res) => {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;
    try{
        const user = await User.findById(userId);

        if(!user){
            return res.status(OK).json(errorResponse(NOT_FOUND,"User tidak ditemukan",{}));
        }

        const isPasswordCorrect= await bcrypt.compare(oldPassword,user.Password);
        if(!isPasswordCorrect){
            return res.status(BAD_REQUEST).json(errorResponse(GENERAL_ERROR,"Password lama anda salah",{}));
        }

        const generateSalt = await bcrypt.genSalt(10);
        
        const hashNewPassword = await bcrypt.hash(newPassword,generateSalt);

        const updatedPassword = {
            Password : hashNewPassword
        };

        await User.update(updatedPassword, {
            where: {
                UserId: userId
            }
        });

        return res.status(OK).json(successResponse(NO_ERROR,"Change Password Successfully",{}));
    }
    catch(err){
        console.log(err);
        return res.status(INTERNAL_ERROR).json(errorResponse(SYSTEM_ERROR, '', {}));
    }
}


module.exports = {
                    signIn, 
                    signUp, 
                    changePassword, 
                    adminLogin, 
                    addUser, 
                    updateUser, 
                    deleteUser, 
                    getAllUser,
                    getUserById
                };