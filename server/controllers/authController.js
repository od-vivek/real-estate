const User = require("../models/User");
const bcryptjs = require('bcryptjs');

exports.postSignup = async (req, res, next) => {
    const { username, email, password } = req.body;

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username, email, password: hashedPassword
    });

    try {
        await newUser.save();
        res.status(201).json('User Created successfully !');
    } catch (error) {
        next(error);
    }
}
