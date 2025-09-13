export const formatCurrency = (amount) => {
    return `$${amount || '0.00'}`;
}

export const formatBoolean = (value) => {
    return value ? 'Yes' : 'No';
}


export const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';

    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

export const formatDateForInput = (timestamp) => {
    if (!timestamp) return new Date().toISOString().split('T')[0];

    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const convertDateToTimestamp = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const localDate = new Date(year, month - 1, day, 12, 0, 0);
    return Math.floor(localDate.getTime() / 1000);
}
