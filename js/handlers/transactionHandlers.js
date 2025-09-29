const transactionHandlers = {
    handleEditTransaction: async (transactionId) => {
        try {
            const response = await transactionService.fetchTransactionById(transactionId);

            if (!response.success || !response.data) {
                messageUtils.showError('Falha ao carregar dados da transação');
                return;
            }

            const transaction = response.data;

            formHandlers.openTransactionModal('edit', transactionId);

            document.getElementById('transaction-description').value = transaction.description || '';
            document.getElementById('transaction-amount').value = transaction.amount || '';
            document.getElementById('transaction-category').value = transaction.category || '';
            document.getElementById('transaction-type').value = transaction.transaction_type || '';
            document.getElementById('transaction-essential-expense').checked = transaction.essential_expense || false;
            document.getElementById('transaction-date').value = formatters.formatDateForInput(transaction.date);
        } catch (error) {
            console.error('Error loading transaction:', error);
            messageUtils.showError(`Erro: ${error.message}`);
        }
    },

    handleDeleteTransaction: async (transactionId) => {
        if (!confirm('Tem certeza que deseja excluir esta transação?')) {
            return;
        }

        try {
            const response = await transactionService.deleteTransaction(transactionId);

            if (response.success) {
                messageUtils.showSuccess('Transação excluída com sucesso!');
                await transactionManager.loadTransactions();
            } else {
                messageUtils.showError(`Erro: ${response.error || 'Falha ao excluir transação'}`);
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            messageUtils.showError(`Erro: ${error.message}`);
        }
    }
};