import mongoose from 'mongoose';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/authdb';

mongoose
    .connect(MONGO_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
    })
    .catch((err) => {
        console.error(err);
    });
