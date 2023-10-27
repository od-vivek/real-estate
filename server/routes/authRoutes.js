const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.postSignup);
router.post('/login', authController.postLogin);
router.post('/google', authController.google);
router.get('/signout', authController.getSignout);

module.exports = router;
