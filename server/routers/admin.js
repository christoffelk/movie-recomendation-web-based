const express = require('express');
const router = express.Router();
const { validationAdminLogin } = require('../middlewares/userMiddleware');
const { adminLogin} = require('../controller/user');

router.post('/login', validationAdminLogin, adminLogin);

module.exports = router;