// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

// Format an ISO date for display in booking and admin views.
export const dateFormat = (date) => {
    return new Date(date).toLocaleString('en-US', {
        weekday: 'short', 
        month: 'long',
        day: "numeric",
        hour: 'numeric',
        minute: 'numeric'
    })
}