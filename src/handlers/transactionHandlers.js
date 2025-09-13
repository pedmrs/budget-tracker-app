import {
    fetchTransactionById,
    updateTransaction,
    deleteTransaction
} from '../services/transactionService.js';
import { formatDateForInput, convertDateToTimestamp } from '../utils/formatters.js';
import { showSuccess, showError } from '../utils/messageUtils.js';
import { loadTransactions } from '../services/transactionManager.js';

export const handleEditTransaction = async (transactionId) => {
    try {
        const response = await fetchTransactionById(transactionId);

        if (!response.success || !response.data) {
            showError('Failed to load transaction data');
            return;
        }

        const transaction = response.data;

        document.getElementById('edit-transaction-id').value = transaction.id;
        document.getElementById('edit-description').value = transaction.description || '';
        document.getElementById('edit-amount').value = transaction.amount || '';
        document.getElementById('edit-category').value = transaction.category || '';
        document.getElementById('edit-transaction-type').value = transaction.transaction_type || '';
        document.getElementById('edit-essential-expense').checked = transaction.essential_expense || false;
        document.getElementById('edit-date').value = formatDateForInput(transaction.date);

        const modal = new bootstrap.Modal(document.getElementById('editTransactionModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading transaction:', error);
        showError(`Error: ${error.message}`);
    }
}

export const handleSaveEdit = async () => {
    const transactionId = document.getElementById('edit-transaction-id').value;
    const dateString = document.getElementById('edit-date').value;
    const dateTimestamp = convertDateToTimestamp(dateString);

    const updatedData = {
        description: document.getElementById('edit-description').value,
        amount: parseFloat(document.getElementById('edit-amount').value),
        category: document.getElementById('edit-category').value,
        transaction_type: document.getElementById('edit-transaction-type').value,
        essential_expense: document.getElementById('edit-essential-expense').checked,
        date: dateTimestamp
    };

    try {
        const response = await updateTransaction(transactionId, updatedData);

        if (response && response.success) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editTransactionModal'));
            modal.hide();

            showSuccess('Transaction updated successfully!');
            await loadTransactions();
        } else {
            showError(`Error: ${response.error || 'Failed to update transaction'}`);
        }
    } catch (error) {
        console.error('Error updating transaction:', error);
        showError(`Error: ${error.message}`);
    }
}

export const handleDeleteTransaction = async (transactionId) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
        return;
    }

    try {
        const response = await deleteTransaction(transactionId);

        if (response && response.success) {
            showSuccess('Transaction deleted successfully!');
            await loadTransactions();
        } else {
            showError(`Error: ${response.error || 'Failed to delete transaction'}`);
        }
    } catch (error) {
        console.error('Error deleting transaction:', error);
        showError(`Error: ${error.message}`);
    }
}
