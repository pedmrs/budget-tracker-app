const formatters = {
    formatCurrency: (amount) => {
        return `R$${amount || '0.00'}`;
    },

    formatBoolean: (value) => {
        return value ? 'Sim' : 'Não';
    },

    formatTransactionType: (type) => {
        return type === 'income' ? 'Receita' : 'Despesa';
    },

    formatDate: (timestamp) => {
        if (!timestamp) return 'N/A';

        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    },

    formatDateForInput: (timestamp) => {
        if (!timestamp) return new Date().toISOString().split('T')[0];

        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    convertDateToTimestamp: (dateString) => {
        const [year, month, day] = dateString.split('-').map(Number);
        const localDate = new Date(year, month - 1, day, 12, 0, 0);
        return Math.floor(localDate.getTime() / 1000);
    },

    formatDateStringForDisplay: (dateString) => {
        if (!dateString) return 'N/A';

        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('pt-BR');
    }
};
