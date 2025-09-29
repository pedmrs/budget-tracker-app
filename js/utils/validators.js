const validators = {
    validateTransactionForm: (formData) => {
        const errors = [];

        if (!formData.get('description')?.trim()) {
            errors.push('Description is required');
        }

        const amount = parseFloat(formData.get('amount'));
        if (!amount || amount <= 0) {
            errors.push('Amount must be a positive number');
        }

        if (!formData.get('category')?.trim()) {
            errors.push('Category is required');
        }

        if (!formData.get('transaction_type')) {
            errors.push('Transaction type is required');
        }

        if (!formData.get('date')) {
            errors.push('Date is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};
