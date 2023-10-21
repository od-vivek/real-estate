const userController = require('../controllers/userController');
const express = require('express');
const verifyUser = require('../utils/verifyUser');
const router = express.Router();

// router.get('/test', test);
router.post('/update/:id', verifyUser, userController);

module.exports = router;
