const userController = require('../controllers/userController');
const express = require('express');
const verifyUser = require('../utils/verifyUser');
const router = express.Router();

// router.get('/test', test);
router.post('/update/:id', verifyUser , userController.updateUser);
router.delete('/delete/:id', verifyUser , userController.deleteUser);

module.exports = router;
