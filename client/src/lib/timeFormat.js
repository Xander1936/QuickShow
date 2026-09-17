// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

const timeFormat = (minutes) => {
    // This function takes a number of minutes as input and converts it into a string format of hours and minutes.
    const hours = Math.floor(minutes / 60);
    // Calculate the remaining minutes after converting to hours.
    const minutesRemainder = minutes % 60; // Use the modulo operator to get the remainder of minutes after dividing by 60.
    return `${hours}h ${minutesRemainder}m`; // Return the formatted string in the format "Xh Ym", where X is the number of hours and Y is the remaining minutes.
}

export default timeFormat;