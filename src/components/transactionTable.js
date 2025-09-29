import { formatCurrency, formatDate, formatBoolean, formatTransactionType } from '../utils/formatters.js';
import { handleDeleteTransaction, handleEditTransaction } from '../handlers/transactionHandlers.js';

export const populateTransactionsTable = (transactions, paginationData = null) => {
    const tbody = document.querySelector('.table tbody');
    tbody.innerHTML = '';

    const existingPagination = document.querySelector('.pagination-container');
    if (existingPagination) {
        existingPagination.remove();
    }

    if (transactions && transactions.length > 0) {
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.description || 'N/A'}</td>
                <td>${formatCurrency(transaction.amount)}</td>
                <td>${transaction.category || 'N/A'}</td>
                <td>${formatTransactionType(transaction.transaction_type) || 'N/A'}</td>
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

    const { currentPage, totalPages, totalItems, itemsPerPage } = paginationData;
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container d-flex justify-content-between align-items-center mt-3';

    const paginationInfo = document.createElement('div');
    const startItem = transactions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = startItem + transactions.length - 1;
    paginationInfo.className = 'pagination-info text-muted';
    paginationInfo.textContent = transactions.length > 0
        ? `Mostrando ${startItem}-${endItem} de ${totalItems} transações`
        : 'Nenhuma transação encontrada';

    const paginationControls = document.createElement('nav');
    paginationControls.setAttribute('aria-label', 'Navegação de páginas');
    paginationControls.innerHTML = `
        <ul class="pagination mb-0">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <button class="page-link" data-page="${currentPage - 1}" aria-label="Anterior">
                    <span aria-hidden="true">&laquo;</span>
                </button>
            </li>
            ${generatePageNumbers(currentPage, totalPages)}
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <button class="page-link" data-page="${currentPage + 1}" aria-label="Próximo">
                    <span aria-hidden="true">&raquo;</span>
                </button>
            </li>
        </ul>
    `;
    paginationContainer.appendChild(paginationInfo);
    paginationContainer.appendChild(paginationControls);

    const tableContainer = document.querySelector('.table-responsive');
    tableContainer.parentNode.insertBefore(paginationContainer, tableContainer.nextSibling);

    paginationContainer.querySelectorAll('.page-link').forEach(button => {
        button.addEventListener('click', (e) => {
            if (!button.parentElement.classList.contains('disabled')) {
                const page = parseInt(button.dataset.page, 10);
                const event = new CustomEvent('pageChange', { detail: { page } });
                document.dispatchEvent(event);
            }
        });
    });
}

const generatePageNumbers = (currentPage, totalPages) => {
    let pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);
        if (currentPage > 3) {
            pages.push('...');
        }
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) {
            pages.push('...');
        }
        pages.push(totalPages);
    }
    return pages.map(page => {
        if (page === '...') {
            return '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
        return `
            <li class="page-item ${page === currentPage ? 'active' : ''}">
                <button class="page-link" data-page="${page}">${page}</button>
            </li>
        `;
    }).join('');
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
