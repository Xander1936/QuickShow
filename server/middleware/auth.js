// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

import { clerkClient } from '@clerk/express';

export const protectAdmin = async (req, res, next) => {
    try {
        const { userId } = req.auth();

        const user = await clerkClient.users.getUser(userId);

        if(user.privateMetadata.role !== 'admin') {
            return res.json({ success: false, message: 'Access denied. Admins only.' });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: 'Not authorized.' });
    }
}