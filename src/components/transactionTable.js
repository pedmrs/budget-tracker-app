import { formatCurrency, formatDate, formatBoolean } from '../utils/formatters.js';
import { handleDeleteTransaction, handleEditTransaction } from '../handlers/transactionHandlers.js';

export const populateTransactionsTable = (transactions) => {
    const tbody = document.querySelector('.table tbody');
    tbody.innerHTML = '';

    if (transactions && transactions.length > 0) {
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.description || 'N/A'}</td>
                <td>${formatCurrency(transaction.amount)}</td>
                <td>${transaction.category || 'N/A'}</td>
                <td>${transaction.transaction_type || 'N/A'}</td>
                <td>${formatBoolean(transaction.essential_expense)}</td>
                <td>${formatDate(transaction.date)}</td>
                <td class="text-center">
                    <div class="btn-group" role="group" aria-label="Ações para ${transaction.description || 'transação'}">
                        <button class="btn btn-primary btn-sm edit-transaction"
                                data-id="${transaction.id}"
                                title="Editar ${transaction.description || 'transação'}"
                                aria-label="Editar transação: ${transaction.description || 'transação'}">
                            <i class="bi bi-pencil" aria-hidden="true"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-transaction"
                                data-id="${transaction.id}"
                                title="Excluir ${transaction.description || 'transação'}"
                                aria-label="Excluir transação: ${transaction.description || 'transação'}">
                            <i class="bi bi-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);

            const deleteButton = row.querySelector('.delete-transaction');
            const editButton = row.querySelector('.edit-transaction');

            if (deleteButton) {
                deleteButton.addEventListener('click', () => {
                    handleDeleteTransaction(transaction.id);
                });
            }

            if (editButton) {
                editButton.addEventListener('click', () => {
                    handleEditTransaction(transaction.id);
                });
            }
        });
    } else {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 7;
        cell.className = 'text-center text-muted py-3';
        cell.textContent = 'Nenhuma transação encontrada';
        row.appendChild(cell);
        tbody.appendChild(row);
    }
}

export const showTableError = (message) => {
    const tbody = document.querySelector('.table tbody');
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 7;
    cell.className = 'text-center text-danger py-3';
    cell.textContent = message;
    row.appendChild(cell);
    tbody.innerHTML = '';
    tbody.appendChild(row);
}
