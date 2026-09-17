// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

// K Converter
export const kConverter = (num) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "k"
    } else {
        return num
    }
}