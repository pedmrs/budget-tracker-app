import { fetchAllTransactions, fetchTransactionSummary } from './transactionService.js';
import { populateTransactionsTable, showTableError } from '../components/transactionTable.js';
import { renderCharts } from '../components/charts.js';
import { getCurrentDateFilter } from '../app.js';

const ITEMS_PER_PAGE = 20;
let currentPage = 1;

document.addEventListener('pageChange', (e) => {
    loadTransactions(e.detail.page);
});

export const loadTransactions = async (page = null) => {
    try {
        if (page) {
            currentPage = page;
        }

        const dateFilter = getCurrentDateFilter();
        const paginationParams = {
            limit: ITEMS_PER_PAGE,
            offset: (currentPage - 1) * ITEMS_PER_PAGE
        };

        const [transactionsResponse, summaryResponse] = await Promise.all([
            fetchAllTransactions(dateFilter, paginationParams),
            fetchTransactionSummary(dateFilter)
        ]);

        if (transactionsResponse?.success && transactionsResponse?.data) {
            const totalItems = transactionsResponse.count;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
            const paginationData = {
                currentPage,
                totalPages,
                totalItems,
                itemsPerPage: ITEMS_PER_PAGE
            };

            populateTransactionsTable(transactionsResponse.data, paginationData);
        } else if (transactionsResponse && transactionsResponse.success === false) {
            showTableError(`Erro da API: ${transactionsResponse.error}`);
        } else {
            showTableError('Não foi possível carregar as transações');
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
        showTableError(`Erro ao carregar transações: ${error.message}. Verifique se a API está rodando em http://localhost:5000`);
    }
}
