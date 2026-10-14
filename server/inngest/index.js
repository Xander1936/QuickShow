// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.
import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk',
        triggers: { event: 'clerk/user.created' }
    },
    async ({ event }) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.create(userData)
    }
)

// Inngest Function to delete user from databse
const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk',
        triggers: { event: 'clerk/user.deleted' }
    },
    async ({ event }) => {
        const {id} = event.data
        await User.findByIdAndDelete(id)
    }
)

// Inngest Function to update user data to database
const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk',
        triggers: { event: 'clerk/user.updated' }
    },
    async ({ event }) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.findByIdAndUpdate(id, userData)
    }
)

// Inngest Function to cancel booking and release seats of show
//  after 10 minutes of booking created if payment is not made
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    {
        id: 'release-seats-delete-booking',
        triggers: { event: "app/checkpayment" }
    },
    async ({event, step}) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

        await step.run('check-payment-status', async() => {
            try {
                const bookingId = event.data && event.data.bookingId;
                if(!bookingId) {
                    console.log('[inngest] missing bookingId in event.data');
                    return;
                }

                const booking = await Booking.findById(bookingId);

                if(!booking){
                    console.log(`[inngest] booking ${bookingId} not found`);
                    return;
                }

                if(!booking.isPaid){
                    const show = await Show.findById(booking.show);

                    if(!show){
                        await Booking.findByIdAndDelete(booking._id);
                        console.log(`[inngest] show for booking ${bookingId} not found — booking deleted`);
                        return;
                    }

                    let changed = false;

                    if(Array.isArray(booking.bookedSeats)){
                        booking.bookedSeats.forEach((seat) => {
                            if(show.occupiedSeats && show.occupiedSeats[seat] === booking.user){
                                delete show.occupiedSeats[seat];
                                changed = true;
                            }
                        });
                    }

                    if(changed){
                        show.markModified('occupiedSeats');
                        await show.save();
                    }

                    await Booking.findByIdAndDelete(booking._id);
                    console.log(`[inngest] released seats and deleted booking ${bookingId}`);
                }
            } catch (error) {
                console.error('[inngest] releaseSeatsAndDeleteBooking failed:', error);
            }
        })
    }
)

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking
];
