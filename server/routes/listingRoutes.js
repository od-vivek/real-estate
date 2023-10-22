const express = require('express');
const listingController = require('../controllers/listingController');
const verifyUser = require('../utils/verifyUser');
const router = express.Router();

router.post('/create', verifyUser, listingController.createListing);

module.exports = router;