const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { calculateMonthsToPayoff, calculateRemainingBalanceOverTime } = require('./calculator'); // Import calculator functions

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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

    // Render chart with remaining balance over time
    res.send(`<div><canvas id="myChart" width="800" height="400"></canvas></div>
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
            <div>Months to Payoff: ${monthsToPayoff}</div>`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
