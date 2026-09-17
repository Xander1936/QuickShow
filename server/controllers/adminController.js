// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express';

// API to check if user is admin or not
export const isAdmin = async (req, res) => {
    try {
        const { userId } = req.auth();

        if (!userId) {
            return res.json({ success: true, isAdmin: false });
        }

        const user = await clerkClient.users.getUser(userId);

        res.json({
            success: true,
            isAdmin: user.privateMetadata.role === 'admin'
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, isAdmin: false });
    }
}

// API to get dashboard data for admin
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({isPaid: true});
        const activeShows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie');

        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser
        };

        res.json({ success: true, dashboardData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all shows for admin
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime: 1});
        res.json({ success: true, shows });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// PI to get all bookings for admin
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user').populate({
            path: 'show',
            populate: {
                path: 'movie'
            }
        }).sort({createdAt: -1});
        res.json({ success: true, bookings });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}