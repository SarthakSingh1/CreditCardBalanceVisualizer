document.addEventListener("DOMContentLoaded", function () {
    const monthsToPayoffContainer = document.getElementById('months-to-payoff');
    const form = document.getElementById('calculator-form');
    const ctx = document.getElementById('myChart').getContext('2d');
    let myChart; // Define myChart variable outside event listener

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Serialize form data
        const formData = new FormData(form);
        const serializedForm = {};
        for (const [key, value] of formData.entries()) {
            serializedForm[key] = value;
        }

        // Send form data to server using AJAX request
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serializedForm)
        })
            .then(response => response.json())
            .then(data => {
                // Destroy the existing chart instance if it exists
                if (myChart) {
                    myChart.destroy();
                }

                // Create a new chart instance with updated data
                myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.balanceOverTime.labels,
                        datasets: [{
                            label: 'Remaining Balance',
                            data: data.balanceOverTime.data,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                monthsToPayoffContainer.textContent = `Months to Payoff: ${data.monthsToPayoff}`;

            })
            .catch(error => console.error('Error:', error));
    });
});