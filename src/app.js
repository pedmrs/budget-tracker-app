import { loadTransactions } from './services/transactionManager.js';
import { openTransactionModal, handleSaveTransaction } from './handlers/formHandlers.js';

const initializeApp = () => {
    loadTransactions();

    const refreshBtn = document.querySelector('#refresh-btn');
    const addTransactionBtn = document.querySelector('#add-transaction-btn');
    const saveTransactionBtn = document.querySelector('#save-transaction-btn');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadTransactions);
    }

    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', () => openTransactionModal('add'));
    }

    if (saveTransactionBtn) {
        saveTransactionBtn.addEventListener('click', handleSaveTransaction);
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);

