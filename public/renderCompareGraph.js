document.addEventListener("DOMContentLoaded", function () {
    const monthsToPayoffContainer1 = document.getElementById('months-to-payoff-1');
    const totalInterestContainer1 = document.getElementById("total-interest-paid-1");
    const monthsToPayoffContainer2 = document.getElementById('months-to-payoff-2');
    const totalInterestContainer2 = document.getElementById("total-interest-paid-2");

    const form = document.getElementById('calculator-form');
    const donutChart1 = document.getElementById('donutChart1').getContext('2d');
    const interestBarChart1 = document.getElementById('interestBarChart1').getContext('2d'); // Get context for pie chart
    const basicBarChart1 = document.getElementById('basicBarChart1').getContext('2d');

    const donutChart2 = document.getElementById('donutChart2').getContext('2d');
    const interestBarChart2 = document.getElementById('interestBarChart2').getContext('2d'); // Get context for pie chart
    const basicBarChart2 = document.getElementById('basicBarChart2').getContext('2d');




    let myDonutChart1; 
    let myInterestBarChart1; 
    let myBasicBarChart1;

    let myDonutChart2;
    let myInterestBarChart2;
    let myBasicBarChart2;

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Serialize form data
        const formData = new FormData(form);

        const urlParams = new URLSearchParams(window.location.search);

        const oldForm = {
            totalBalance1: urlParams.get('totalBalance'),
            apr1: urlParams.get('apr'),
            maxMonthlyPayment1: urlParams.get('maxMonthlyPayment'),
            extraMonthlySpend1: urlParams.get('extraMonthlySpend'),
            paymentType: urlParams.get('paymentType')
        };

        

        // console.log("compare submit hit");
        // console.log(newData);


        
        const serializedForm = {};
        for (const [key, value] of formData.entries()) {
            serializedForm[key] = value;
        }

        const mergedDict = Object.assign({}, serializedForm, oldForm);

        console.log(mergedDict);


        // Send form data to server using AJAX request
        fetch('/calculateCompare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mergedDict)
        })
            .then(response => response.json())
            .then(data => {
                // Destroy the existing chart instances if they exist
                if (myDonutChart1) {
                    myDonutChart1.destroy();
                }
                if (myInterestBarChart1) {
                    myInterestBarChart1.destroy();
                }
                if (myBasicBarChart1) {
                    myBasicBarChart1.destroy();
                }
                if (myDonutChart2) {
                    myDonutChart2.destroy();
                }
                if (myInterestBarChart2) {
                    myInterestBarChart2.destroy();
                }
                if (myBasicBarChart2) {
                    myBasicBarChart2.destroy();
                }
                // Create a new line chart instance with updated data
                console.log(data);
                let firstGraphs = data.firstGraphs; 
                let secondGraphs = data.secondGraphs; 

//                 
// 
// 
// FIRST GRAPHS HERE
// 
// 
//                 
                myDonutChart1 = new Chart(donutChart1, {
                    type: 'doughnut',
                    data: {
                        labels: ['Principal', 'Interest'],
                        datasets: [{
                            data: [firstGraphs.totalPrincipal, firstGraphs.totalInterest],
                            backgroundColor: ['#FBC600', '#34657F']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });

                myInterestBarChart1 = new Chart(interestBarChart1, {
                    type: 'bar',
                    data: {
                        labels: Array.from({ length: firstGraphs.months }, (_, i) => i + 1),
                        datasets: [{
                            label: 'Principal',
                            data: firstGraphs.princpial_data,
                            backgroundColor: '#FBC600' // Blue color for principal
                        }, {
                            label: 'Interest',
                            data: firstGraphs.interest_data,
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

                myBasicBarChart1 = new Chart(basicBarChart1, {
                    type: 'bar',
                    data: {
                        labels: Array.from({ length: firstGraphs.months }, (_, i) => i + 1),
                        datasets: [{
                            label: 'Principal',
                            data: firstGraphs.balance_over_time,
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
                
//                 SECOND GRAPHS HERE
// 
// 
// 
// 
// 
//                 
                myDonutChart2 = new Chart(donutChart2, {
                    type: 'doughnut',
                    data: {
                        labels: ['Principal', 'Interest'],
                        datasets: [{
                            data: [secondGraphs.totalPrincipal, secondGraphs.totalInterest],
                            backgroundColor: ['#FBC600', '#34657F']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });

                myInterestBarChart2 = new Chart(interestBarChart2, {
                    type: 'bar',
                    data: {
                        labels: Array.from({ length: secondGraphs.months }, (_, i) => i + 1),
                        datasets: [{
                            label: 'Principal',
                            data: secondGraphs.princpial_data,
                            backgroundColor: '#FBC600' // Blue color for principal
                        }, {
                            label: 'Interest',
                            data: secondGraphs.interest_data,
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

                myBasicBarChart2 = new Chart(basicBarChart2, {
                    type: 'bar',
                    data: {
                        labels: Array.from({ length: secondGraphs.months }, (_, i) => i + 1),
                        datasets: [{
                            label: 'Principal',
                            data: secondGraphs.balance_over_time,
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
                if (firstGraphs.monthlyPayment != null) {
                    monthsToPayoffContainer1.textContent = `Monthly Payment $${firstGraphs.monthlyPayment.toFixed(2)}`;
                } else {
                    monthsToPayoffContainer1.textContent = `Months to Payoff: ${firstGraphs.months}`;
                }
                let roundedInterest = firstGraphs.totalInterest.toFixed(2);
                totalInterestContainer1.textContent = `Total Interest Paid: $${roundedInterest}`;

                if (secondGraphs.monthlyPayment != null) {
                    monthsToPayoffContainer2.textContent = `Monthly Payment: $${secondGraphs.monthlyPayment.toFixed(2) }`;
                } else {
                monthsToPayoffContainer2.textContent = `Months to Payoff: ${secondGraphs.months}`;
                }
                let roundedInterest2 = secondGraphs.totalInterest.toFixed(2);
                totalInterestContainer2.textContent = `Total Interest Paid: $${roundedInterest2}`;
            })
            .catch(error => console.error('Error:', error));
    });
    console.log("Got to the end");
});
