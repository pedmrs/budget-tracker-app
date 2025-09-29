const formHandlers = {
    handleTransactionTypeChange: (event) => {
        const transactionType = event.target.value;
        const essentialExpenseCheckbox = document.getElementById('transaction-essential-expense');

        if (transactionType === 'income') {
            essentialExpenseCheckbox.checked = false;
            essentialExpenseCheckbox.disabled = true;
        } else {
            essentialExpenseCheckbox.disabled = false;
        }
    },

    closeTransactionModal: () => {
        const modalElement = document.getElementById('transactionModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    },

    openTransactionModal: (mode = 'add', transactionId = null) => {
        const modalElement = document.getElementById('transactionModal');
        const modalTitle = document.getElementById('transactionModalLabel');
        const modalDesc = document.getElementById('transactionModalDesc');
        const saveBtn = document.getElementById('save-transaction-btn');
        const saveBtnText = document.getElementById('save-btn-text');
        const form = document.getElementById('transaction-form');
        const transactionIdField = document.getElementById('transaction-id');
        const transactionType = document.getElementById('transaction-type');
        const cancelBtn = document.querySelector('[data-bs-dismiss="modal"]');

        form.reset();
        transactionIdField.value = '';

        transactionType.addEventListener('change', formHandlers.handleTransactionTypeChange);

        formHandlers.handleTransactionTypeChange({ target: transactionType });

        if (mode === 'add') {
            modalTitle.textContent = 'Adicionar Nova Transação';
            modalDesc.textContent = 'Preencha os detalhes da sua nova transação abaixo.';
            saveBtnText.textContent = 'Criar Transação';
            saveBtn.className = 'btn btn-success';

            transactionType.value = 'expense';
            formHandlers.handleTransactionTypeChange({ target: transactionType });
        } else {
            modalTitle.textContent = 'Editar Transação';
            modalDesc.textContent = 'Atualize os detalhes da sua transação abaixo.';
            saveBtnText.textContent = 'Salvar Alterações';
            saveBtn.className = 'btn btn-primary';
            transactionIdField.value = transactionId;
        }

        const modal = new bootstrap.Modal(modalElement);

        modalElement.addEventListener('hidden.bs.modal', () => {
            transactionType.removeEventListener('change', formHandlers.handleTransactionTypeChange);
            formHandlers.closeTransactionModal();
        }, { once: true });

        if (cancelBtn) {
            cancelBtn.addEventListener('click', formHandlers.closeTransactionModal, { once: true });
        }

        const closeBtn = modalElement.querySelector('.btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', formHandlers.closeTransactionModal, { once: true });
        }

        modal.show();
    },

    handleSaveTransaction: async () => {
        const form = document.getElementById('transaction-form');
        const formData = new FormData(form);
        const transactionId = document.getElementById('transaction-id').value;
        const isEdit = transactionId !== '';

        const validation = validators.validateTransactionForm(formData);
        if (!validation.isValid) {
            messageUtils.showError(validation.errors.join(', '));
            return;
        }

        const dateString = formData.get('date');
        const dateTimestamp = formatters.convertDateToTimestamp(dateString);

        const essentialExpenseCheckbox = document.getElementById('transaction-essential-expense');

        const transaction = {
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount')),
            category: formData.get('category'),
            transaction_type: formData.get('transaction_type'),
            essential_expense: essentialExpenseCheckbox.checked,
            date: dateTimestamp
        };

        try {
            let response;
            if (isEdit) {
                response = await transactionService.updateTransaction(transactionId, transaction);
            } else {
                response = await transactionService.createTransaction(transaction);
            }

            if (response && response.success) {
                formHandlers.closeTransactionModal();

                const successMessage = isEdit ? 'Transação atualizada com sucesso!' : 'Transação criada com sucesso!';
                messageUtils.showSuccess(successMessage);
                form.reset();
                await transactionManager.loadTransactions();
            } else {
                const errorMessage = isEdit ? 'Falha ao atualizar transação' : 'Falha ao criar transação';
                messageUtils.showError(`Erro: ${response.error || errorMessage}`);
            }
        } catch (error) {
            console.error('Error saving transaction:', error);
            messageUtils.showError(`Erro: ${error.message}`);
        }
    }
};