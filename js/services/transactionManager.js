const transactionManager = {
    ITEMS_PER_PAGE: 20,
    currentPage: 1,

    loadTransactions: async (page = null) => {
        try {
            if (page) {
                transactionManager.currentPage = page;
            }

            const dateFilter = app.getCurrentDateFilter();
            const paginationParams = {
                limit: transactionManager.ITEMS_PER_PAGE,
                offset: (transactionManager.currentPage - 1) * transactionManager.ITEMS_PER_PAGE
            };

            const [transactionsResponse, summaryResponse] = await Promise.all([
                transactionService.fetchAllTransactions(dateFilter, paginationParams),
                transactionService.fetchTransactionSummary(dateFilter)
            ]);

            if (transactionsResponse?.success && transactionsResponse?.data) {
                const totalItems = transactionsResponse.count;
                const totalPages = Math.ceil(totalItems / transactionManager.ITEMS_PER_PAGE);
                const paginationData = {
                    currentPage: transactionManager.currentPage,
                    totalPages,
                    totalItems,
                    itemsPerPage: transactionManager.ITEMS_PER_PAGE
                };

                transactionTable.populateTransactionsTable(transactionsResponse.data, paginationData);
            } else if (transactionsResponse && transactionsResponse.success === false) {
                transactionTable.showTableError(`Erro da API: ${transactionsResponse.error}`);
            } else {
                transactionTable.showTableError('Não foi possível carregar as transações');
            }

            if (summaryResponse && summaryResponse.success && summaryResponse.data) {
                await charts.renderCharts(summaryResponse.data);
            } else {
                console.error('Error loading summary:', summaryResponse);
            }
        } catch (error) {
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            transactionTable.showTableError(`Erro ao carregar transações: ${error.message}. Verifique se a API está rodando em http://localhost:5000`);
        }
    }
};

document.addEventListener('pageChange', (e) => {
    transactionManager.loadTransactions(e.detail.page);
});
