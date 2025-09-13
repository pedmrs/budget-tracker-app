let incomeExpenseChart = null;
let categoryChart = null;

export const renderCharts = async (summaryData) => {
    const incomeExpenseCtx = document.getElementById('incomeExpenseChart').getContext('2d');
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');

    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
        incomeExpenseChart = null;
    }
    if (categoryChart) {
        categoryChart.destroy();
        categoryChart = null;
    }

    incomeExpenseChart = new Chart(incomeExpenseCtx, {
        type: 'bar',
        data: {
            labels: ['Receitas', 'Despesas', 'Despesas Essenciais'],
            datasets: [{
                label: 'Valor (R$)',
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
                        callback: (value) => 'R$ ' + value.toFixed(2)
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => `R$ ${context.raw.toFixed(2)}`
                    }
                }
            }
        }
    });

    const categoryData = summaryData.expense_by_category || {};
    categoryChart = new Chart(categoryCtx, {
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
                            return `${label}: R$ ${value}`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Total de Despesas por Categoria'
                }
            }
        }
    });
}
