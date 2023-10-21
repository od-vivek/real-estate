const User = require("../models/User");
const { errorHandler } = require("../utils/error")
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

module.exports = updateUser = async (req, res, next) => {
    if (req.user.id != req.params.id) {
        return next(errorHandler(401, 'You can only change details for your own account !!'));
    }
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(errorHandler(400, 'Invalid ObjectId provided'));
        }

        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            },
        }, { new: true })

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}