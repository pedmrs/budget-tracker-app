import { loadTransactions } from './services/transactionManager.js';
import { openTransactionModal, handleSaveTransaction } from './handlers/formHandlers.js';
import { formatDateStringForDisplay } from './utils/formatters.js';

let currentDateFilter = {
    startDate: null,
    endDate: null
};

const initializeDateFilter = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    currentDateFilter.startDate = startOfMonth.toISOString().split('T')[0];
    currentDateFilter.endDate = endOfMonth.toISOString().split('T')[0];

    document.getElementById('start-date').value = currentDateFilter.startDate;
    document.getElementById('end-date').value = currentDateFilter.endDate;

    updateFilterStatus();
};

const updateFilterStatus = () => {
    const statusElement = document.getElementById('filter-status');
    if (currentDateFilter.startDate && currentDateFilter.endDate) {
        const startDateFormatted = formatDateStringForDisplay(currentDateFilter.startDate);
        const endDateFormatted = formatDateStringForDisplay(currentDateFilter.endDate);
        statusElement.textContent = `Filtro: ${startDateFormatted} - ${endDateFormatted}`;
    } else {
        statusElement.textContent = 'Filtro: Todas as transações';
    }
};

const applyDateFilter = () => {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
            alert('A data inicial não pode ser posterior à data final.');
            return;
        }

        currentDateFilter.startDate = startDate;
        currentDateFilter.endDate = endDate;
        updateFilterStatus();
        loadTransactions();
    }
};

const clearDateFilter = () => {
    currentDateFilter.startDate = null;
    currentDateFilter.endDate = null;
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    updateFilterStatus();
    loadTransactions();
};

export const getCurrentDateFilter = () => currentDateFilter;

const initializeApp = () => {
    initializeDateFilter();
    loadTransactions();

    const refreshBtn = document.querySelector('#refresh-btn');
    const addTransactionBtn = document.querySelector('#add-transaction-btn');
    const saveTransactionBtn = document.querySelector('#save-transaction-btn');
    const applyFilterBtn = document.querySelector('#apply-filter-btn');
    const clearFilterBtn = document.querySelector('#clear-filter-btn');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadTransactions);
    }

    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', () => openTransactionModal('add'));
    }

    if (saveTransactionBtn) {
        saveTransactionBtn.addEventListener('click', handleSaveTransaction);
    }

    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyDateFilter);
    }

    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', clearDateFilter);
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);

