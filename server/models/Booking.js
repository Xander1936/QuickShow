// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {type:String, required:true, ref:'User'},
    show: {type:String, required:true, ref:'Show'},
    amount: {type:Number, required:true},
    bookedSeats: {type: Array, required:true},
    isPaid: {type:Boolean, default:false},
    paymentLink: {type:String},
}, {timestamps:true});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;