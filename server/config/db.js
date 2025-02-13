const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URL;

        if (!mongoUri) {
            throw new Error('MONGO_URL is not defined');
        }

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            authSource: 'admin'
        };

        await mongoose.connect(mongoUri, options);
        console.log('MongoDB Connected Successfully');

        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

    } catch (error) {
        console.error('MongoDB connection error:', error);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
