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
