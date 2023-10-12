const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database connected !'))
    .catch(err => console.log(err));

const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000 !!');
});

app.use('/api/test', userRoutes);
app.use('/api/auth', authRoutes);

//error handling middleware
app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal server error!';

    // console.log(err);

    return res.status(status).json({
        success : 'false' ,
        status ,
        message : message 
    })
});