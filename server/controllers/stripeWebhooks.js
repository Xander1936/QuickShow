// import stripe from "stripe";

// Import the application's shared, configured Stripe client.
import stripe from '../configs/stripe.js';
import Booking from '../models/Booking.js'

export const stripeWebhooks = async (request, response) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                })

                const session = sessionList.data[0];
                const { bookingId } = session.metadata;

                await Booking.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: ""
                })
            }

                break;
            
            default:
                console.log('Unhandled event type:', event.type)
        }
        response.json({received: true})
    } catch (err) {
        console.error("Webhook processing error:", err);
        response.status(500).send("Internal Server Error");
    }
}

export const handleStripeWebhook = async (req, res) => {
    // Security requirement: Stripe uses the unparsed raw body to verify its signature.
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody, // Stripe requires the unparsed request buffer for verification.
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`[CRITICAL] Webhook Signature Verification Failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Route verified events to their asynchronous handlers.
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log(`[SUCCESS] Payment verified for Customer: ${session.customer}`);
        // Trigger the Inngest workflow that provisions the user's access.
    }

    res.json({ received: true });
};
