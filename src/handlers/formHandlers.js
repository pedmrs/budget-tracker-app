import { createTransaction } from '../services/transactionService.js';
import { convertDateToTimestamp } from '../utils/formatters.js';
import { validateTransactionForm } from '../utils/validators.js';
import { showSuccess, showError } from '../utils/messageUtils.js';
import { loadTransactions } from '../services/transactionManager.js';

export const handleCreateTransaction = async (event) => {
    event.preventDefault();

    const form = document.querySelector('#create-transaction-form');
    const formData = new FormData(form);

    const validation = validateTransactionForm(formData);
    if (!validation.isValid) {
        showError(validation.errors.join(', '));
        return;
    }

    const dateString = formData.get('date');
    const dateTimestamp = convertDateToTimestamp(dateString);

    const transaction = {
        description: formData.get('description'),
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        transaction_type: formData.get('transaction_type'),
        essential_expense: formData.get('essential_expense') === 'on',
        date: dateTimestamp
    };

    try {
        const response = await createTransaction(transaction);

        if (response && response.success) {
            showSuccess('Transaction created successfully!');
            form.reset();
            await loadTransactions();
        } else {
            showError(`Error: ${response.error || 'Failed to create transaction'}`);
        }
    } catch (error) {
        console.error('Error creating transaction:', error);
        showError(`Error: ${error.message}`);
    }
}
