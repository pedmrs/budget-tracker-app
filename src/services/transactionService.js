const API_BASE_URL = 'http://localhost:5000';

export const fetchAllTransactions = async () => {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    const data = await response.json();
    return data;
}

export const fetchTransactionSummary = async () => {
    const response = await fetch(`${API_BASE_URL}/transactions/summary`);
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
