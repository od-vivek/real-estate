const User = require('../models/User');
const Listing = require('../models/Listing');
const { errorHandler } = require('../utils/error');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

exports.updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only change details for your own account'));
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(errorHandler(400, 'Invalid ObjectId provided'));
        }

        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only delete your own account'));
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User deleted successfully');
    } catch (error) {
        next(error);
    }
};

exports.getListings = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};

exports.getPublicUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const { password, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};
