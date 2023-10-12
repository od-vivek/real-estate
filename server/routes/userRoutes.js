const test = require('../controllers/user');
const express = require('express');
const router = express.Router();

router.get('/test', test);

module.exports = router;
