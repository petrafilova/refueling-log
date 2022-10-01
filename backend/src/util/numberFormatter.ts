export const roundToTwoDecimals = (num: number | null) => {
    if (num === null || isNaN(num)) {
        return 0;
    }
    return (Math.round(num * 100) / 100);
}