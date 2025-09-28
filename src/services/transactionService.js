import { convertDateToTimestamp } from '../utils/formatters.js';

const API_BASE_URL = 'http://localhost:5000';

const formatRequestParams = (dateFilter, paginationParams = null) => {
    const params = new URLSearchParams();

    if (dateFilter.startDate) {
        const startTimestamp = convertDateToTimestamp(dateFilter.startDate);
        params.append('start_date', startTimestamp);
    }
    if (dateFilter.endDate) {
        const endTimestamp = convertDateToTimestamp(dateFilter.endDate);
        params.append('end_date', endTimestamp);
    }

    if (paginationParams) {
        if (paginationParams.limit) {
            params.append('limit', paginationParams.limit);
        }
        if (typeof paginationParams.offset === 'number') {
            params.append('offset', paginationParams.offset);
        }
    }

    return params.toString();
}

export const fetchAllTransactions = async (dateFilter = null, paginationParams = null) => {
    const params = formatRequestParams(dateFilter, paginationParams);
    const url = `${API_BASE_URL}/transactions?${params}`;
    const response = await fetch(url);
    return response.json();
}

export const fetchTransactionSummary = async (dateFilter = null) => {
    const params = formatRequestParams(dateFilter);
    const url = `${API_BASE_URL}/transactions/summary?${params}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export const fetchTransactionById = async (transactionId) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`);
    const data = await response.json();
    return data;
}

export const createTransaction = async (transaction) => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
    });
    const data = await response.json();
    return data;
}

export const updateTransaction = async (transactionId, updatedData) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });
    const data = await response.json();
    return data;
}

export const deleteTransaction = async (transactionId) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    return data;
}
