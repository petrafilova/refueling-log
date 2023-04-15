/**
 *  @param {number|null} num - Number we want to round up to two decimal places
 *  @returns {number} - Number rounded to two decimal places
 */
export const roundToTwoDecimals = (num: number | null) => {
    if (num === null || isNaN(num)) {
        return 0;
    }
    return Math.round(num * 100) / 100;
};
