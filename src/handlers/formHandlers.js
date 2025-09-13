import { createTransaction, updateTransaction } from '../services/transactionService.js';
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
            showSuccess('Transação criada com sucesso!');
            form.reset();
            await loadTransactions();
        } else {
            showError(`Erro: ${response.error || 'Falha ao criar transação'}`);
        }
    } catch (error) {
        console.error('Error creating transaction:', error);
        showError(`Erro: ${error.message}`);
    }
}

export const openTransactionModal = (mode = 'add', transactionId = null) => {
    const modal = document.getElementById('transactionModal');
    const modalTitle = document.getElementById('transactionModalLabel');
    const modalDesc = document.getElementById('transactionModalDesc');
    const saveBtn = document.getElementById('save-transaction-btn');
    const saveBtnText = document.getElementById('save-btn-text');
    const form = document.getElementById('transaction-form');
    const transactionIdField = document.getElementById('transaction-id');

    form.reset();
    transactionIdField.value = '';

    if (mode === 'add') {
        modalTitle.textContent = 'Adicionar Nova Transação';
        modalDesc.textContent = 'Preencha os detalhes da sua nova transação abaixo.';
        saveBtnText.textContent = 'Criar Transação';
        saveBtn.className = 'btn btn-success';
    } else {
        modalTitle.textContent = 'Editar Transação';
        modalDesc.textContent = 'Atualize os detalhes da sua transação abaixo.';
        saveBtnText.textContent = 'Salvar Alterações';
        saveBtn.className = 'btn btn-primary';
        transactionIdField.value = transactionId;
    }

    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

export const handleSaveTransaction = async () => {
    const form = document.getElementById('transaction-form');
    const formData = new FormData(form);
    const transactionId = document.getElementById('transaction-id').value;
    const isEdit = transactionId !== '';

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
        let response;
        if (isEdit) {
            response = await updateTransaction(transactionId, transaction);
        } else {
            response = await createTransaction(transaction);
        }

        if (response && response.success) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'));
            modal.hide();

            const successMessage = isEdit ? 'Transação atualizada com sucesso!' : 'Transação criada com sucesso!';
            showSuccess(successMessage);
            form.reset();
            await loadTransactions();
        } else {
            const errorMessage = isEdit ? 'Falha ao atualizar transação' : 'Falha ao criar transação';
            showError(`Erro: ${response.error || errorMessage}`);
        }
    } catch (error) {
        console.error('Error saving transaction:', error);
        showError(`Erro: ${error.message}`);
    }
}
