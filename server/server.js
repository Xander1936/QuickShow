// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import { handleStripeWebhook } from './controllers/bookingController.js';

const app = express();

// Establish the database connection before accepting requests.
await connectDB();

// Configure middleware and request parsers before registering routes.
app.use(cors());

// Preserve the raw request body so Stripe can verify webhook signatures.
app.use(express.json({
    verify: (req, res, buf) => {
        if (req.originalUrl === '/api/booking/webhook') {
            req.rawBody = buf;
        }
    }
}));

// Attach Clerk authentication data to every request.
app.use(clerkMiddleware());

// Register the health check and application routes.
app.get('/', (req, res) => res.send('Server is Live!'));
app.get('/api/health', (req, res) => res.send('System status: Active & Secured'));

// Register the dedicated Stripe webhook endpoint.
app.post('/api/booking/webhook', handleStripeWebhook);

// Register the remaining QuickShow feature routes.
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

// Start a runtime that works in both local and production environments.
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`[SERVER ACTIVE] Running at http://localhost:${PORT}`));

export default app; // For Vercel deployment and testing purposes
