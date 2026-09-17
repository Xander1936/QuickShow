// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

import express from 'express';
import { createBooking, getOccupiedSeats } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);

export default bookingRouter;