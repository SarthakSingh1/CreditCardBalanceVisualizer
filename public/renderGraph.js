document.addEventListener("DOMContentLoaded", function () {
    const monthsToPayoffContainer = document.getElementById('months-to-payoff');
    const form = document.getElementById('calculator-form');
    const ctx = document.getElementById('myChart').getContext('2d');
    const ctxPie = document.getElementById('myPieChart').getContext('2d'); // Get context for pie chart
    const final_cart = document.getElementById('additionalChart').getContext('2d');

    let myChart; // Define myChart variable outside event listener
    let myPieChart; // Define myPieChart variable outside event listener
    let finalChart;

    form.addEventListener('submit', function (event) {
        console.log("Form submitted");
        event.preventDefault(); // Prevent default form submission

        // Serialize form data
        const formData = new FormData(form);
        const serializedForm = {};
        for (const [key, value] of formData.entries()) {
            serializedForm[key] = value;
        }

        console.log("Sent the stuff");


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
                console.log(data);
                // Destroy the existing chart instances if they exist
                if (myChart) {
                    myChart.destroy();
                }
                if (myPieChart) {
                    myPieChart.destroy();
                }
                if (finalChart) {
                    finalChart.destroy();
                }

                // Create a new line chart instance with updated data
                myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: Array.from({ length: data.months }, (_, i) => i + 1),
                        datasets: [{
                            label: 'Principal',
                            data: data.princpial_data,
                            backgroundColor: '#FBC600' // Blue color for principal
                        }, {
                            label: 'Interest',
                            data: data.interest_data,
                            backgroundColor: '#34657F' // Red color for interest
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                stacked: true // Stack bars horizontally
                            },
                            y: {
                                stacked: true // Stack bars vertically
                            }
                        }
                    }
                });

                finalChart = new Chart(final_cart, { 
                    type: 'bar',
                    data: {
                        labels: Array.from({ length: data.months }, (_, i) => i + 1),
                        datasets: [{
                            label: 'Principal',
                            data: data.balance_over_time,
                            backgroundColor: '#FBC600' // Blue color for principal
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                stacked: true 
                            },
                            y: {
                                stacked: true 
                            }
                        }
                    }
                });

                // Create a new pie chart instance with updated data
                myPieChart = new Chart(ctxPie, {
                    type: 'doughnut',
                    data: {
                        labels: ['Principal', 'Interest'],
                        datasets: [{
                            data: [data.totalPrincipal, data.totalInterest],
                            backgroundColor: ['#FBC600', '#34657F']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });

                monthsToPayoffContainer.textContent = `Months to Payoff: ${data.months}`;

            })
            .catch(error => console.error('Error:', error));
    });
    console.log("Got to the end");
});
