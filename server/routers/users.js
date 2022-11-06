const express = require('express');
const { adminAuthentication, validationAddUser, validationUpdateUser, validationSignIn, validationSignUp, validationChangePassword } = require('../middlewares/userMiddleware');
const { signIn, signUp, changePassword, addUser, updateUser, deleteUser, getAllUser, getUserById } = require('../controller/user');


const router = express.Router();

router.post('/signin', validationSignIn, signIn);
router.post('/signup', validationSignUp, signUp);
router.patch('/changePassword', validationChangePassword, changePassword);
router.post('/', [adminAuthentication, ...validationAddUser], addUser);
router.put('/:userId', [adminAuthentication, ...validationUpdateUser], updateUser);
router.delete('/:userId', adminAuthentication, deleteUser);
router.get('/', adminAuthentication, getAllUser);
router.get('/:userId', adminAuthentication, getUserById);

module.exports =  router;
