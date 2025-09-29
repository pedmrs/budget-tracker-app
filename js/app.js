const app = {
    currentDateFilter: {
        startDate: null,
        endDate: null
    },

    initializeDateFilter: () => {
        if (!app.currentDateFilter.startDate || !app.currentDateFilter.endDate) {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            app.currentDateFilter.startDate = startOfMonth.toISOString().split('T')[0];
            app.currentDateFilter.endDate = endOfMonth.toISOString().split('T')[0];
        }

        document.getElementById('start-date').value = app.currentDateFilter.startDate;
        document.getElementById('end-date').value = app.currentDateFilter.endDate;

        app.updateFilterStatus();
    },

    updateFilterStatus: () => {
        const statusElement = document.getElementById('filter-status');
        if (app.currentDateFilter.startDate && app.currentDateFilter.endDate) {
            const startDateFormatted = formatters.formatDateStringForDisplay(app.currentDateFilter.startDate);
            const endDateFormatted = formatters.formatDateStringForDisplay(app.currentDateFilter.endDate);
            statusElement.textContent = `Filtro: ${startDateFormatted} - ${endDateFormatted}`;
        } else {
            statusElement.textContent = 'Filtro: Todas as transações';
        }
    },

    applyDateFilter: () => {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        if (startDate && endDate) {
            if (new Date(startDate) > new Date(endDate)) {
                alert('A data inicial não pode ser posterior à data final.');
                return;
            }

            app.currentDateFilter.startDate = startDate;
            app.currentDateFilter.endDate = endDate;
            app.updateFilterStatus();
            transactionManager.loadTransactions();
        }
    },

    clearDateFilter: () => {
        app.currentDateFilter.startDate = null;
        app.currentDateFilter.endDate = null;
        document.getElementById('start-date').value = '';
        document.getElementById('end-date').value = '';
        app.updateFilterStatus();
        transactionManager.loadTransactions();
    },

    getCurrentDateFilter: () => app.currentDateFilter,

    initializeApp: () => {
        app.initializeDateFilter();
        transactionManager.loadTransactions();

        const refreshBtn = document.querySelector('#refresh-btn');
        const addTransactionBtn = document.querySelector('#add-transaction-btn');
        const saveTransactionBtn = document.querySelector('#save-transaction-btn');
        const applyFilterBtn = document.querySelector('#apply-filter-btn');
        const clearFilterBtn = document.querySelector('#clear-filter-btn');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => transactionManager.loadTransactions());
        }

        if (addTransactionBtn) {
            addTransactionBtn.addEventListener('click', () => formHandlers.openTransactionModal('add'));
        }

        if (saveTransactionBtn) {
            saveTransactionBtn.addEventListener('click', formHandlers.handleSaveTransaction);
        }

        if (applyFilterBtn) {
            applyFilterBtn.addEventListener('click', app.applyDateFilter);
        }

        if (clearFilterBtn) {
            clearFilterBtn.addEventListener('click', app.clearDateFilter);
        }
    }
};

document.addEventListener('DOMContentLoaded', app.initializeApp);
