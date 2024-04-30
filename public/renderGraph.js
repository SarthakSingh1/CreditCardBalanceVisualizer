document.addEventListener("DOMContentLoaded", function () {
    const monthsToPayoffContainer = document.getElementById('months-to-payoff');
    const totalInterestContainer = document.getElementById("total-interest-paid");
    const form = document.getElementById('calculator-form');
    const ctx = document.getElementById('myChart').getContext('2d');
    const ctxPie = document.getElementById('myPieChart').getContext('2d'); // Get context for pie chart
    const final_cart = document.getElementById('additionalChart').getContext('2d');
    const secondButton = document.getElementById('compare-button');
    const monthlyToolTip = document.getElementById('maxMonthlyPaymentTooltip');
    const payoffMonth = document.getElementById('monthsToPayoff');

    let myChart; // Define myChart variable outside event listener
    let myPieChart; // Define myPieChart variable outside event listener
    let finalChart;
    const paymentTypeSelect = document.getElementById('paymentType');
    const outputValue = document.getElementById('months-to-payoff');

    // Add event listener for change event
    paymentTypeSelect.addEventListener('change', function () {
        // Check the selected value
        const selectedValue = paymentTypeSelect.value;
        const labelElement = document.querySelector('label[for="maxMonthlyPayment"]');
        const textNode = monthlyToolTip.childNodes[0];
        const monthsTextNode = payoffMonth.childNodes[0];
        // Depending on the selected value, execute your script
        if (selectedValue === 'totalMonths') {
            // Code to execute when "Total Months" is selected
            console.log('Total Months selected');
            labelElement.textContent = "Total Months:";
            outputValue.textContent = "Monthly Payment";
            textNode.textContent = "Please indicate the number of months in which you want to pay off your balance. Keep in mind that the longer you extend this period, the more interest you will end up paying overall. ";
            monthsTextNode.textContent = "This is the monthly payment needed to pay off your balance in the number of months you selected. ";
        } else if (selectedValue === 'maxMonthlyPayment') {
            // Code to execute when "Max Monthly Payment" is selected
            console.log('Max Monthly Payment selected');
            labelElement.textContent = "Max Monthly Payment:";
            outputValue.textContent = "Months to Payoff";
            textNode.textContent = "Please indicate the monthly payment you prefer to contribute towards paying off your balance. Keep in mind that opting for a lower payment will result in higher interest charges and a longer duration to pay off your balance. ";
            monthsTextNode.textContent = "This is the number of months needed to pay off your balance by making monthly payments at the amount you selected. ";
        }
    });


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
                if (data.monthlyPayment != null) {
                    monthsToPayoffContainer.textContent = `Monthly Payment $${data.monthlyPayment.toFixed(2)}`;
                } else {
                    if (data.months == 0) {
                        monthsToPayoffContainer.textContent = `Impossible to pay off card`;
                    } else {
                monthsToPayoffContainer.textContent = `Months to Payoff: ${data.months}`;
                    }
                }
                let roundedInterest = data.totalInterest.toFixed(2);

                totalInterestContainer.textContent =  `Total Interest Paid: $${roundedInterest}`;
            })
            .catch(error => console.error('Error:', error));
    });
    console.log("Got to the end");
});
