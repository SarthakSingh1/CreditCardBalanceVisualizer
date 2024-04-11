const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module

const { calculateMonthsToPayoff } = require('./calculator'); // Import calculator functions

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
    console.log("Called calculate route")
    const totalBalance = parseFloat(req.body.totalBalance);
    const apr = parseFloat(req.body.apr);
    const maxMonthlyPayment = parseFloat(req.body.maxMonthlyPayment);
    const extraMonthlySpend = parseFloat(req.body.extraMonthlySpend);


    // Perform calculations
    const calculationResult = calculateMonthsToPayoff(totalBalance, apr, maxMonthlyPayment, extraMonthlySpend);


    // Send the response
    console.log("Sent a response");
    res.send(calculationResult);
});

app.get('/compare', (req, res) => {
    console.log("Compare called"); 
    res.sendFile(path.resolve(__dirname, '..', 'public', 'compare.html'));
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});