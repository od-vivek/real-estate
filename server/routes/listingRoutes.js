const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const verifyUser = require('../utils/verifyUser');

router.post('/create',  listingController.createListing);
router.delete('/delete/:id', listingController.deleteListing);
router.post('/update/:id', listingController.updateListing);
router.get('/get/:id', listingController.getListing);
router.get('/get', listingController.getListings); // for search

module.exports = router;
