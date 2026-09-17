// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`)
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB;