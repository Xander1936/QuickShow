// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
    {
        movie: { type: String, ref: 'Movie', required: true },
        showDateTime: { type: Date, required: true },
        showPrice: { type: Number, required: true },
        occupiedSeats: { type: {}, default: {} }
    }, {minimize: false}
)

const Show = mongoose.model('Show', showSchema);

export default Show;