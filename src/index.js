const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module

const { calculateMonthsToPayoff, calculateRemainingBalanceOverTime } = require('./calculator'); // Import calculator functions

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json()); 

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'views', 'index.html'));
});

// Route for form submission
app.post('/calculate', (req, res) => {
    // Extract input data from request body
    console.log(req.body)
    const totalBalance = parseFloat(req.body.totalBalance);
    const apr = parseFloat(req.body.apr);
    const maxMonthlyPayment = parseFloat(req.body.maxMonthlyPayment);
    const extraMonthlySpend = parseFloat(req.body.extraMonthlySpend);

    // Perform calculations
    const monthsToPayoff = calculateMonthsToPayoff(totalBalance, apr, maxMonthlyPayment, extraMonthlySpend);
    const balanceOverTime = calculateRemainingBalanceOverTime(totalBalance, apr, maxMonthlyPayment, extraMonthlySpend);

    // Send the response
    res.send({
        totalBalance,
        apr,
        maxMonthlyPayment,
        extraMonthlySpend,
        monthsToPayoff,
        balanceOverTime
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});