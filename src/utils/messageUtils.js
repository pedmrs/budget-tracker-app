const showMessage = (message, type) => {
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;

    const form = document.querySelector('#create-transaction-form');
    if (form) {
        form.closest('.card-body').insertBefore(messageDiv, form);
    }

    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

export const showError = (message) => {
    showMessage(message, 'error');
}

export const showSuccess = (message) => {
    showMessage(message, 'success');
}
