import {
    fetchTransactionById,
    deleteTransaction
} from '../services/transactionService.js';
import { formatDateForInput } from '../utils/formatters.js';
import { showSuccess, showError } from '../utils/messageUtils.js';
import { loadTransactions } from '../services/transactionManager.js';
import { openTransactionModal } from './formHandlers.js';

export const handleEditTransaction = async (transactionId) => {
    try {
        const response = await fetchTransactionById(transactionId);

        if (!response.success || !response.data) {
            showError('Falha ao carregar dados da transação');
            return;
        }

        const transaction = response.data;

        openTransactionModal('edit', transactionId);

        document.getElementById('transaction-description').value = transaction.description || '';
        document.getElementById('transaction-amount').value = transaction.amount || '';
        document.getElementById('transaction-category').value = transaction.category || '';
        document.getElementById('transaction-type').value = transaction.transaction_type || '';
        document.getElementById('transaction-essential-expense').checked = transaction.essential_expense || false;
        document.getElementById('transaction-date').value = formatDateForInput(transaction.date);
    } catch (error) {
        console.error('Error loading transaction:', error);
        showError(`Erro: ${error.message}`);
    }
}


export const handleDeleteTransaction = async (transactionId) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) {
        return;
    }

    try {
        const response = await deleteTransaction(transactionId);

        if (response && response.success) {
            showSuccess('Transação excluída com sucesso!');
            await loadTransactions();
        } else {
            showError(`Erro: ${response.error || 'Falha ao excluir transação'}`);
        }
    } catch (error) {
        console.error('Error deleting transaction:', error);
        showError(`Erro: ${error.message}`);
    }
}
