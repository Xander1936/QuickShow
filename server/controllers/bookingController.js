// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import stripe from 'stripe';

// Function to check availability of selected seats for a movie
const checkSeatAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        if(!showData) return false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {showId, selectedSeats} = req.body;
        const {origin} = req.headers;

        // Check if the selected seats are available
        const isAvailable = await checkSeatAvailability(showId, selectedSeats);

        if(!isAvailable) {
            return res.json({success: false, message: 'Selected seats are not available.'});
        }

        // Get the show details
        const showData = await Show.findById(showId).populate('movie');

        // Create a new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');

        await showData.save();
        
        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        // Creating line items too for Stripe
        const line_items = [{
            price_data: {
                currency: 'usd',
                product_data:{
                    name: showData.movie.title
                },
                unit_amount: Math.floor(booking.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            // success_url: `${origin}/loading/my-bookings`,
            success_url: `${origin}/my-bookings?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/my-bookings`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                bookingId: booking._id.toString()
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
        })

        booking.paymentLink = session.url
        await booking.save()

        res.json({success: true, url: session.url})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {

        const {showId} = req.params;
        const showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats);

        res.json({success: true, occupiedSeats});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

export const handleStripeWebhook = async (req, res) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    let event;

    try {
        const signature = req.headers['stripe-signature'];

        event = stripeInstance.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error('Stripe webhook signature error:', error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        if (session.payment_status === 'paid') {
            await Booking.findByIdAndUpdate(
                session.metadata.bookingId,
                { isPaid: true }
            );
        }
    }

    res.json({ received: true });
};

export const createPaymentSession = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { bookingId } = req.body;
        const { origin } = req.headers;

        const booking = await Booking.findOne({
            _id: bookingId,
            user: userId,
            isPaid: false
        }).populate({
            path: 'show',
            populate: {
                path: 'movie'
            }
        });

        if (!booking) {
            return res.json({
                success: false,
                message: 'Booking not found or already paid.'
            });
        }

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: booking.show.movie.title
                },
                unit_amount: Math.floor(booking.amount) * 100
            },
            quantity: 1
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/my-bookings?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/my-bookings`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                bookingId: booking._id.toString()
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
        });

        booking.paymentLink = session.url;
        await booking.save();

        res.json({ success: true, url: session.url });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};