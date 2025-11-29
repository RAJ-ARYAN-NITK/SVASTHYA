import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
