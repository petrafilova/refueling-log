export const padNumber = (num) => {
    return String(num).padStart(2, '0');
};

export const isoDateTimeToString = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = padNumber(date.getMonth() + 1);
    const day = padNumber(date.getDate());
    const hour = padNumber(date.getHours());
    const minute = padNumber(date.getMinutes());

    const formattedDate = `${day}.${month}.${year} ${hour}:${minute}`;
    return formattedDate;
};