const express = require('express');
const verifyUser = require('../utils/verifyUser');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/update/:id', verifyUser, userController.updateUser);
router.delete('/delete/:id', verifyUser, userController.deleteUser);
router.get('/listings/:id', verifyUser, userController.getListings);
router.get('/:id', verifyUser, userController.getPublicUser);

module.exports = router;
