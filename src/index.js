const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module

const { calculateMonthsToPayoff, calculatePayment } = require('./calculator'); // Import calculator functions

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(express.json());

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'views', 'index.html'));
});

// Route for form submission
app.post('/calculate', (req, res) => {
    // Extract input data from request body
    const paymentType = req.body.paymentType; 
    const totalBalance = parseFloat(req.body.totalBalance);
    const apr = parseFloat(req.body.apr);
    const maxMonthlyPayment = parseFloat(req.body.maxMonthlyPayment);
    const extraMonthlySpend = parseFloat(req.body.extraMonthlySpend);

    let calculationResult = {};
    // Perform calculations
    if (paymentType == "maxMonthlyPayment") {
        calculationResult = calculateMonthsToPayoff(totalBalance, apr, maxMonthlyPayment, extraMonthlySpend);
    } else {
        calculationResult = calculatePayment(totalBalance, apr, maxMonthlyPayment, extraMonthlySpend);
    }
    // Send the response
    res.send(calculationResult);
});

app.get('/compare', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'compare.html'));
});

app.post('/calculateCompare', (req, res) => {

    const totalBalance1 = parseFloat(req.body.totalBalance1);
    const apr1 = parseFloat(req.body.apr1);
    const maxMonthlyPayment1 = parseFloat(req.body.maxMonthlyPayment1);
    const extraMonthlySpend1 = parseFloat(req.body.extraMonthlySpend1);

    const totalBalance2 = parseFloat(req.body.totalBalance2);
    const apr2 = parseFloat(req.body.apr2);
    const maxMonthlyPayment2 = parseFloat(req.body.maxMonthlyPayment2);
    const extraMonthlySpend2 = parseFloat(req.body.extraMonthlySpend2);
    
    let calculationResult1 = {};
    let calculationResult2 = {};
    console.log(req.body.paymentType);
    if (req.body.paymentType == "maxMonthlyPayment") {
        calculationResult1 = calculateMonthsToPayoff(totalBalance1, apr1, maxMonthlyPayment1, extraMonthlySpend1);
        calculationResult2 = calculateMonthsToPayoff(totalBalance2, apr2, maxMonthlyPayment2, extraMonthlySpend2);
    } else {
        calculationResult1 = calculatePayment(totalBalance1, apr1, maxMonthlyPayment1, extraMonthlySpend1);
        calculationResult2 = calculatePayment(totalBalance2, apr2, maxMonthlyPayment2, extraMonthlySpend2); 
    }

    res.send({ "firstGraphs": calculationResult1, "secondGraphs": calculationResult2 });
});





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});