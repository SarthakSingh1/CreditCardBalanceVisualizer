const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module

const { calculateMonthsToPayoff, calculateRemainingBalanceOverTime } = require('./calculator'); // Import calculator functions

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'views', 'index.html'));
});

// Route for form submission
app.post('/calculate', (req, res) => {
    // Extract input data from request body
    const totalBalance = parseFloat(req.body.totalBalance);
    const apr = parseFloat(req.body.apr);
    const maxMonthlyPayment = parseFloat(req.body.maxMonthlyPayment);
    const extraMonthlySpend = parseFloat(req.body.extraMonthlySpend);

    // Calculate months to payoff
    const monthsToPayoff = calculateMonthsToPayoff(totalBalance, apr, maxMonthlyPayment, extraMonthlySpend);

    // Calculate remaining balance over time
    const balanceOverTime = calculateRemainingBalanceOverTime(totalBalance, apr, maxMonthlyPayment, extraMonthlySpend);

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Financial Literacy Visualizations</title>
        <style>
            .payoff-info-container {
                background-color: #f0f0f0;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
            }
            .payoff-info-label {
                font-family: Arial, sans-serif;
                font-size: 14px;
                color: #666;
            }
            .payoff-info-amount {
                font-family: Arial, sans-serif;
                font-size: 24px;
                color: #333;
            }
            .input-info-container {
                margin-bottom: 20px;
                display: inline-block; /* Change from flex to inline-block */
                width: 48%; /* Adjust width as needed */
                vertical-align: top; /* Align top */
            }
            .input-info-label,
            .input-info-value {
                font-family: Arial, sans-serif;
                font-size: 14px;
                color: #333;
            }
        </style>
        </head>
        <body>
          <div class="payoff-info-container">
        <div class="payoff-info-label">Months to Payoff</div>
        <div class="payoff-info-amount">$${monthsToPayoff}</div>
        </div>
        <div class="input-info-container">
            <div class="input-info-label">Total Balance:</div>
            <div class="input-info-value">$${totalBalance}</div>
        </div>
        <div class="input-info-container">
            <div class="input-info-label">APR:</div>
            <div class="input-info-value">${apr}%</div>
        </div>
        <div class="input-info-container">
            <div class="input-info-label">Max Monthly Payment:</div>
            <div class="input-info-value">$${maxMonthlyPayment}</div>
        </div>
        <div class="input-info-container">
            <div class="input-info-label">Extra Monthly Spend:</div>
            <div class="input-info-value">$${extraMonthlySpend}</div>
        </div>

            <div><canvas id="myChart" width="800" height="400"></canvas></div>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>
                var ctx = document.getElementById('myChart').getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ${JSON.stringify(balanceOverTime.labels)},
                        datasets: [{
                            label: 'Remaining Balance',
                            data: ${JSON.stringify(balanceOverTime.data)},
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
            </script>
        </body>
        </html>
    `;
    res.send(htmlContent);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});