import { loadTransactions } from './services/transactionManager.js';
import { handleCreateTransaction } from './handlers/formHandlers.js';
import { handleSaveEdit } from './handlers/transactionHandlers.js';

const initializeApp = () => {
    loadTransactions();

    const form = document.querySelector('#create-transaction-form');
    const refreshBtn = document.querySelector('#refresh-btn');
    const saveEditBtn = document.querySelector('#save-edit-btn');

    if (form) {
        form.addEventListener('submit', (event) => {
            handleCreateTransaction(event);
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadTransactions);
    }

    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', handleSaveEdit);
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
