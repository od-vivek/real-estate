const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const errorHandler = require('../utils/error');

exports.postSignup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 12);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json('User created successfully!');
    } catch (error) {
        next(error);
    }
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHandler(404, 'User Not Found!'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) {
            return next(errorHandler(401, 'Invalid Credentials'));
        }
        //dont need password on the server(only used when logging in)
        const {password : pass , ...rest } = validUser._doc;

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        res.cookie('access-token', token, { httpOnly: true }).status(200).json(validUser);

    } catch (error) {
        return;
    }
}
