export const fetchAllTransactions = async () => {
    const response = await fetch('http://localhost:5000/transactions');
    const data = await response.json();
    return data;
}

export const populateTransactionsTable = (transactions) => {
    const tbody = document.querySelector('#transactions tbody');
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
            `;
            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6">No transactions found</td>';
        tbody.appendChild(row);
    }
}

export const loadTransactions = async () => {
    try {
        const response = await fetchAllTransactions();
        
        if (response && response.success && response.data) {
            populateTransactionsTable(response.data);
        } else if (response && response.success === false) {
            const tbody = document.querySelector('#transactions tbody');
            tbody.innerHTML = `<tr><td colspan="6" class="error-message">API Error: ${response.error}</td></tr>`;
        } else {
            const tbody = document.querySelector('#transactions tbody');
            tbody.innerHTML = '<tr><td colspan="6" class="error-message">Unexpected response format from API</td></tr>';
        }
    } catch (error) {
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        const tbody = document.querySelector('#transactions tbody');
        tbody.innerHTML = `<tr><td colspan="6" class="error-message">Error loading transactions: ${error.message}. Please check if the API is running on http://localhost:5000</td></tr>`;
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
    form.appendChild(messageDiv);
    
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
    
    if (form) {
        form.addEventListener('submit', handleCreateTransaction);
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadTransactions);
    }
});
