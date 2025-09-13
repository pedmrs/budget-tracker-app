import { fetchAllTransactions, fetchTransactionSummary } from './transactionService.js';
import { populateTransactionsTable, showTableError } from '../components/transactionTable.js';
import { renderCharts } from '../components/charts.js';

export const loadTransactions = async () => {
    try {
        const [transactionsResponse, summaryResponse] = await Promise.all([
            fetchAllTransactions(),
            fetchTransactionSummary()
        ]);

        if (transactionsResponse && transactionsResponse.success && transactionsResponse.data) {
            populateTransactionsTable(transactionsResponse.data);
        } else if (transactionsResponse && transactionsResponse.success === false) {
            showTableError(`API Error: ${transactionsResponse.error}`);
        } else {
            showTableError('Unexpected response format from API');
        }

        if (summaryResponse && summaryResponse.success && summaryResponse.data) {
            await renderCharts(summaryResponse.data);
        } else {
            console.error('Error loading summary:', summaryResponse);
        }
    } catch (error) {
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        showTableError(`Error loading transactions: ${error.message}. Please check if the API is running on http://localhost:5000`);
    }
}
