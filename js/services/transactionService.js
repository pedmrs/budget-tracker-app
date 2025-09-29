const transactionService = {
    API_BASE_URL: 'http://localhost:5000',

    formatRequestParams: (dateFilter, paginationParams = null) => {
        const params = new URLSearchParams();

        if (dateFilter.startDate) {
            const startTimestamp = formatters.convertDateToTimestamp(dateFilter.startDate);
            params.append('start_date', startTimestamp);
        }
        if (dateFilter.endDate) {
            const endTimestamp = formatters.convertDateToTimestamp(dateFilter.endDate);
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
    },

    fetchAllTransactions: async (dateFilter = null, paginationParams = null) => {
        const params = transactionService.formatRequestParams(dateFilter, paginationParams);
        const url = `${transactionService.API_BASE_URL}/transactions?${params}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        return response.json();
    },

    fetchTransactionSummary: async (dateFilter = null) => {
        const params = transactionService.formatRequestParams(dateFilter);
        const url = `${transactionService.API_BASE_URL}/transactions/summary?${params}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    },

    fetchTransactionById: async (transactionId) => {
        const response = await fetch(`${transactionService.API_BASE_URL}/transactions/${transactionId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    },

    createTransaction: async (transaction) => {
        const response = await fetch(`${transactionService.API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(transaction),
        });
        const data = await response.json();
        return data;
    },

    updateTransaction: async (transactionId, updatedData) => {
        const response = await fetch(`${transactionService.API_BASE_URL}/transactions/${transactionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(updatedData),
        });
        const data = await response.json();
        return data;
    },

    deleteTransaction: async (transactionId) => {
        try {
            const response = await fetch(`${transactionService.API_BASE_URL}/transactions/${transactionId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const text = await response.text();
            const data = text ? JSON.parse(text) : { success: response.ok };
            return data;
        } catch (error) {
            console.error('Error in deleteTransaction:', error);
            return { success: false, error: error.message };
        }
    }
};