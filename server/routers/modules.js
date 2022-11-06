const express = require('express');
const router = express.Router();
const { validationAddandUpdateModule, validationDeleteModule, validationSelectModule} = require('../middlewares/moduleMiddleware');
const { addModule, updateModule, deleteModule, getAllModule } = require('../controller/module');


router.post('/',validationAddandUpdateModule, addModule);
router.put('/',validationAddandUpdateModule, updateModule);
router.delete('/',validationDeleteModule, deleteModule);
router.get('/',validationSelectModule, getAllModule);

module.exports = router;