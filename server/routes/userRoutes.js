const express = require('express');
const verifyUser = require('../utils/verifyUser');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/update/:id', userController.updateUser);
router.delete('/delete/:id',  userController.deleteUser);
router.get('/listings/:id',  userController.getListings);
router.get('/:id', userController.getPublicUser);

module.exports = router;
