export const padNumber = (num) => {
    return new String(num).padStart(2, '0');
};

export const formatDate = (utcDate) => {
    const date = new Date(utcDate);

    const year = date.getFullYear();
    const month = padNumber(date.getMonth() + 1);
    const day = padNumber(date.getDate());
    const hours = padNumber(date.getHours());
    const minutes = padNumber(date.getMinutes());

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    return formattedDate;
};