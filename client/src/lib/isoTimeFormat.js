// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

// Convert a date-time value into a localized time string.
const isoTimeFormat = (dateTime) => {
    const date = new Date(dateTime);
    const localTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    return localTime;
}

export default isoTimeFormat;