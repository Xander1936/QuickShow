import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('[CRITICAL] Missing STRIPE_SECRET_KEY in environment variables.');
}

// Create the shared Stripe client used by payment handlers.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16', // Use a stable Stripe API version.
});

export default stripe;
