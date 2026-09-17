// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

import express from 'express';
import { addShow, getNowPlayingMovies, getShow, getShows } from '../controllers/showController.js';
import { protectAdmin } from '../middleware/auth.js';

const showRouter = express.Router();

showRouter.get('/', getShows);
showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies);
showRouter.post('/add', protectAdmin, addShow);
showRouter.get('/all', getShows);
showRouter.get('/:movieId', getShow);

export default showRouter;