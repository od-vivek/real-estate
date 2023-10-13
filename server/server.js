const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected!'))
    .catch(err => console.log(err));

app.use(express.json());

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});

app.use(errorHandler);

function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal server error!';

    return res.status(status).json({
        success: false,
        status,
        message,
    });
}
