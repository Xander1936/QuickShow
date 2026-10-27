// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.
import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";

// Create a client to send and receive events.
export const inngest = new Inngest({ id: "movie-ticket-booking" });

const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk',
        triggers: [{ event: 'clerk/user.created' }]
    },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url, primary_email_address_id } = event.data;
        const email = email_addresses.find(({ id: emailId }) => emailId === primary_email_address_id)
            ?? email_addresses[0];
        if (!email) {
            throw new Error(`Clerk user ${id} does not have an email address.`);
        }

        const userData = {
            _id: id,
            email: email.email_address,
            name: [first_name, last_name].filter(Boolean).join(' '),
            image: image_url
        };
        await User.findByIdAndUpdate(id, userData, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
);

const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk',
        triggers: [{ event: 'clerk/user.deleted' }]
    },
    async ({ event }) => {
        const { id } = event.data;
        if (id) {
            await User.findByIdAndDelete(id);
        }
    }
);

const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk',
        triggers: [{ event: 'clerk/user.updated' }]
    },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url, primary_email_address_id } = event.data;
        const email = email_addresses.find(({ id: emailId }) => emailId === primary_email_address_id)
            ?? email_addresses[0];
        if (!email) {
            throw new Error(`Clerk user ${id} does not have an email address.`);
        }

        const userData = {
            _id: id,
            email: email.email_address,
            name: [first_name, last_name].filter(Boolean).join(' '),
            image: image_url
        };
        await User.findByIdAndUpdate(id, userData, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
);

// Inngest Function to cancel booking and 
// release seats of show after 10 minutes of booking created 
// if payment is not made
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    {
        id: 'release-seats-delete-booking',
        triggers: [{ event: "app/checkpayment" }]
    },
    async ({ event, step }) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

        await step.run('check-payment-status', async() => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId);

            // If payment is not made, release seats and delete booking
            if (booking && !booking.isPaid) {
                const show = await Show.findById(booking.show);
                if (show) {
                    booking.bookedSeats.forEach((seat) => {
                        if (show.occupiedSeats[seat] === booking.user) {
                            delete show.occupiedSeats[seat];
                        }
                    });
                    show.markModified('occupiedSeats');
                    await show.save();
                    await Booking.findByIdAndDelete(booking._id);
                }
                // await Booking.findByIdAndDelete(booking._id);
            }
        });
    }
);

const sendBookingConfirmationEmail = inngest.createFunction(
    {
        id: 'send-booking-confirmation-email',
        triggers: [{ event: 'app/show.booked' }]
    },
    async ({ event, step }) => {
        await step.run('send-booking-confirmation', async () => {
            const booking = await Booking.findById(event.data.bookingId)
                .populate('user')
                .populate({ path: 'show', populate: { path: 'movie' } });

            if (!booking || !booking.isPaid || !booking.user?.email || !booking.show) {
                return;
            }

            const movieTitle = booking.show.movie?.title ?? 'your movie';
            await sendEmail({
                to: booking.user.email,
                subject: `QuickShow booking confirmed: ${movieTitle}`,
                html: `<p>Hello ${booking.user.name},</p>
                    <p>Your booking for <strong>${movieTitle}</strong> is confirmed.</p>
                    <p>Showtime: ${booking.show.showDateTime.toLocaleString()}</p>
                    <p>Seats: ${booking.bookedSeats.join(', ')}</p>`
            });
        });
    }
);

const sendShowReminders = inngest.createFunction(
    {
        id: 'send-show-reminder',
        triggers: [{ event: 'app/show.booked' }]
    },
    async ({ event, step }) => {
        const bookingDetails = await step.run('get-booking-reminder-details', async () => {
            const booking = await Booking.findById(event.data.bookingId)
                .populate('user')
                .populate({ path: 'show', populate: { path: 'movie' } });

            if (!booking || !booking.isPaid || !booking.user?.email || !booking.show) {
                return null;
            }

            return {
                bookingId: booking.id,
                email: booking.user.email,
                userName: booking.user.name,
                movieTitle: booking.show.movie?.title ?? 'your movie',
                showDateTime: booking.show.showDateTime,
                bookedSeats: booking.bookedSeats
            };
        });

        if (!bookingDetails) {
            return;
        }

        const reminderTime = new Date(bookingDetails.showDateTime).getTime() - 24 * 60 * 60 * 1000;
        if (reminderTime <= Date.now()) {
            return;
        }

        await step.sleepUntil('wait-until-one-day-before-show', new Date(reminderTime));
        await step.run('send-show-reminder', async () => {
            const booking = await Booking.findById(bookingDetails.bookingId)
                .populate('user')
                .populate({ path: 'show', populate: { path: 'movie' } });
            if (
                !booking?.isPaid ||
                !booking.user?.email ||
                !booking.show ||
                booking.show.showDateTime <= new Date()
            ) {
                return;
            }

            await sendEmail({
                to: booking.user.email,
                subject: `QuickShow reminder: ${booking.show.movie?.title ?? bookingDetails.movieTitle}`,
                html: `<p>Hello ${booking.user.name},</p>
                    <p>This is a reminder that your show for <strong>${booking.show.movie?.title ?? bookingDetails.movieTitle}</strong> is tomorrow.</p>
                    <p>Showtime: ${booking.show.showDateTime.toLocaleString()}</p>
                    <p>Seats: ${booking.bookedSeats.join(', ')}</p>`
            });
        });
    }
);

const sendNewShowNotifications = inngest.createFunction(
    {
        id: 'send-new-show-notifications',
        triggers: [{ event: 'app/show.added' }]
    },
    async ({ event, step }) => {
        await step.run('notify-users-about-new-show', async () => {
            const users = await User.find({}, { email: 1, name: 1 });
            await Promise.all(users.filter((user) => user.email).map((user) => sendEmail({
                to: user.email,
                subject: `New showtimes on QuickShow: ${event.data.movieTitle}`,
                html: `<p>Hello ${user.name},</p>
                    <p>New showtimes are now available for <strong>${event.data.movieTitle}</strong> on QuickShow.</p>`
            })));
        });
    }
);

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail,
    sendShowReminders,
    sendNewShowNotifications
];
