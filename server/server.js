const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');

app.use(cors({
    origin:["http://localhost:3000", "https://gregarious-raindrop-091940.netlify.app"],
    methods:['POST','GET','HEAD','PUT','DELETE'],
    credentials: true
}))
app.use(cookieParser());

const cookieParser = require('cookie-parser');

dotenv.config();

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Database connected!'))
    .catch(err => console.error(err));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/listing', require('./routes/listingRoutes'));

// Error handling middleware
app.use(errorHandler);

function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(status).json({
        success: false,
        status,
        message,
    });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}!`);
});
