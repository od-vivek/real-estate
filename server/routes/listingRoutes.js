const express = require('express');
const listingController = require('../controllers/listingController');
const verifyUser = require('../utils/verifyUser');
const router = express.Router();

router.post('/create', verifyUser, listingController.createListing);
router.delete('/delete/:id' , verifyUser , listingController.deleteListing);
router.post('/update/:id' , verifyUser , listingController.updateListing);
router.get('/get/:id' , listingController.getListing);
router.get('/get' , listingController.getListings); //for search

module.exports = router;