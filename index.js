const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

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
    // Perform calculations here
    const inputData = req.body.inputData; // Assuming input field name is "inputData"
    // Example calculation
    const result = inputData * 2;

    // Render chart with result
    res.send(`<div><canvas id="myChart" width="400" height="400"></canvas></div>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>
              var ctx = document.getElementById('myChart').getContext('2d');
              var myChart = new Chart(ctx, {
                  type: 'bar',
                  data: {
                      labels: ['Result'],
                      datasets: [{
                          label: 'Calculation Result',
                          data: [${result}],
                          backgroundColor: 'rgba(255, 99, 132, 0.2)',
                          borderColor: 'rgba(255, 99, 132, 1)',
                          borderWidth: 1
                      }]
                  },
                  options: {
                      scales: {
                          yAxes: [{
                              ticks: {
                                  beginAtZero: true
                              }
                          }]
                      }
                  }
              });
            </script>`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
