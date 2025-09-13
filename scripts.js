export const fetchAllTransactions = async () => {
    const response = await fetch('http://localhost:5000/transactions');
    const data = await response.json();
    return data;
}

export const fetchTransactionSummary = async () => {
    const response = await fetch('http://localhost:5000/transactions/summary');
    const data = await response.json();
    return data;
}

export const populateTransactionsTable = (transactions) => {
    const tbody = document.querySelector('.table tbody');
    tbody.innerHTML = '';

    if (transactions && transactions.length > 0) {
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.description || 'N/A'}</td>
                <td>$${transaction.amount || '0.00'}</td>
                <td>${transaction.category || 'N/A'}</td>
                <td>${transaction.transaction_type || 'N/A'}</td>
                <td>${transaction.essential_expense ? 'Yes' : 'No'}</td>
                <td>${transaction.date || 'N/A'}</td>
                <td class="text-center">
                    <div class="btn-group" role="group" aria-label="Transaction actions">
                        <button class="btn btn-primary btn-sm edit-transaction" data-id="${transaction.id}" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-transaction" data-id="${transaction.id}" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);

            const deleteButton = row.querySelector('.delete-transaction');
            const editButton = row.querySelector('.edit-transaction');

            if (deleteButton) {
                deleteButton.addEventListener('click', () => handleDeleteTransaction(transaction.id));
            }

            if (editButton) {
                editButton.addEventListener('click', () => handleEditTransaction(transaction.id));
            }
        });
    } else {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 7;
        cell.className = 'text-center text-muted py-3';
        cell.textContent = 'No transactions found';
        row.appendChild(cell);
        tbody.appendChild(row);
    }
}

export const renderCharts = async (summaryData) => {
    const incomeExpenseCtx = document.getElementById('incomeExpenseChart').getContext('2d');
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');

    new Chart(incomeExpenseCtx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses', 'Essential Expenses'],
            datasets: [{
                label: 'Amount ($)',
                data: [
                    summaryData.income_total || 0,
                    summaryData.expense_total || 0,
                    summaryData.essential_expense_total || 0
                ],
                backgroundColor: ['#4CAF50', '#f44336', '#FFC107'],
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => '$' + value.toFixed(2)
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => `$${context.raw.toFixed(2)}`
                    }
                }
            }
        }
    });

    const categoryData = summaryData.expense_by_category || {};
    new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: [
                    '#4CAF50', '#2196F3', '#f44336', '#FFC107',
                    '#9C27B0', '#FF5722', '#795548', '#607D8B'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw.toFixed(2);
                            return `${label}: $${value}`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Total Expenses by Category'
                }
            }
        }
    });
}

export const loadTransactions = async () => {
    try {
        const [transactionsResponse, summaryResponse] = await Promise.all([
            fetchAllTransactions(),
            fetchTransactionSummary()
        ]);

        if (transactionsResponse && transactionsResponse.success && transactionsResponse.data) {
            populateTransactionsTable(transactionsResponse.data);
        } else if (transactionsResponse && transactionsResponse.success === false) {
            const tbody = document.querySelector('.table tbody');
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 7;
            cell.className = 'text-center text-danger py-3';
            cell.textContent = `API Error: ${transactionsResponse.error}`;
            row.appendChild(cell);
            tbody.innerHTML = '';
            tbody.appendChild(row);
        } else {
            const tbody = document.querySelector('.table tbody');
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 7;
            cell.className = 'text-center text-danger py-3';
            cell.textContent = 'Unexpected response format from API';
            row.appendChild(cell);
            tbody.innerHTML = '';
            tbody.appendChild(row);
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
        const tbody = document.querySelector('.table tbody');
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 7;
        cell.className = 'text-center text-danger py-3';
        cell.textContent = `Error loading transactions: ${error.message}. Please check if the API is running on http://localhost:5000`;
        row.appendChild(cell);
        tbody.innerHTML = '';
        tbody.appendChild(row);
    }
}

export const editTransaction = async (transactionId, updatedData) => {
    const response = await fetch(`http://localhost:5000/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });
    const data = await response.json();
    return data;
}

export const handleEditTransaction = async (transactionId) => {
    try {
        const response = await fetch(`http://localhost:5000/transactions/${transactionId}`);
        const data = await response.json();

        if (!data.success || !data.data) {
            showMessage('Failed to load transaction data', 'error');
            return;
        }

        const transaction = data.data;

        document.getElementById('edit-transaction-id').value = transaction.id;
        document.getElementById('edit-description').value = transaction.description || '';
        document.getElementById('edit-amount').value = transaction.amount || '';
        document.getElementById('edit-category').value = transaction.category || '';
        document.getElementById('edit-transaction-type').value = transaction.transaction_type || '';
        document.getElementById('edit-essential-expense').checked = transaction.essential_expense || false;

        if (transaction.date) {
            const date = new Date(transaction.date * 1000);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            document.getElementById('edit-date').value = formattedDate;
        } else {
            document.getElementById('edit-date').value = new Date().toISOString().split('T')[0];
        }

        const modal = new bootstrap.Modal(document.getElementById('editTransactionModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading transaction:', error);
        showMessage(`Error: ${error.message}`, 'error');
    }
}

export const handleSaveEdit = async () => {
    const transactionId = document.getElementById('edit-transaction-id').value;
    const dateString = document.getElementById('edit-date').value;
    const dateTimestamp = Math.floor(new Date(dateString + 'T00:00:00.000Z').getTime() / 1000);

    const updatedData = {
        description: document.getElementById('edit-description').value,
        amount: parseFloat(document.getElementById('edit-amount').value),
        category: document.getElementById('edit-category').value,
        transaction_type: document.getElementById('edit-transaction-type').value,
        essential_expense: document.getElementById('edit-essential-expense').checked,
        date: dateTimestamp
    };

    try {
        const response = await editTransaction(transactionId, updatedData);

        if (response && response.success) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editTransactionModal'));
            modal.hide();

            showMessage('Transaction updated successfully!', 'success');
            await loadTransactions();
        } else {
            showMessage(`Error: ${response.error || 'Failed to update transaction'}`, 'error');
        }
    } catch (error) {
        console.error('Error updating transaction:', error);
        showMessage(`Error: ${error.message}`, 'error');
    }
}

export const deleteTransaction = async (transactionId) => {
    const response = await fetch(`http://localhost:5000/transactions/${transactionId}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    return data;
}

export const handleDeleteTransaction = async (transactionId) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
        return;
    }

    try {
        const response = await deleteTransaction(transactionId);

        if (response && response.success) {
            showMessage('Transaction deleted successfully!', 'success');
            await loadTransactions();
        } else {
            showMessage(`Error: ${response.error || 'Failed to delete transaction'}`, 'error');
        }
    } catch (error) {
        console.error('Error deleting transaction:', error);
        showMessage(`Error: ${error.message}`, 'error');
    }
}

export const createTransaction = async (transaction) => {
    const response = await fetch('http://localhost:5000/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
    });
    const data = await response.json();
    return data;
}

export const handleCreateTransaction = async (event) => {
    event.preventDefault();

    const form = document.querySelector('#create-transaction-form');
    const formData = new FormData(form);

    const dateString = formData.get('date');
    const dateTimestamp = Math.floor(new Date(dateString + 'T00:00:00.000Z').getTime() / 1000);

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
            showMessage('Transaction created successfully!', 'success');
            form.reset();
            await loadTransactions();
        } else {
            showMessage(`Error: ${response.error || 'Failed to create transaction'}`, 'error');
        }
    } catch (error) {
        console.error('Error creating transaction:', error);
        showMessage(`Error: ${error.message}`, 'error');
    }
}

export const showMessage = (message, type) => {
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;

    const form = document.querySelector('#create-transaction-form');
    form.closest('.card-body').insertBefore(messageDiv, form);

    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();

    const form = document.querySelector('#create-transaction-form');
    const refreshBtn = document.querySelector('#refresh-btn');
    const saveEditBtn = document.querySelector('#save-edit-btn');

    if (form) {
        form.addEventListener('submit', handleCreateTransaction);
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadTransactions);
    }

    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', handleSaveEdit);
    }
});
