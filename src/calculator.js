// calculator.js

function calculateMonthsToPayoff(totalBalance, apr, maxMonthlyPayment, extraMonthlySpend) {
    // Convert APR to monthly periodic rate
    apr /= 100; // Convert percentage to decimal
    let dpr = apr / 365; // Daily periodic rate
    let mpr = dpr * 30; // Monthly periodic rate

    let remainingBalance = totalBalance;
    let months = 0;

    while (remainingBalance > 0) {
        // Calculate interest accrued
        let interest = remainingBalance * mpr;
        // Calculate total payment (minimum payment + extra spend)
        let totalPayment = Math.min(maxMonthlyPayment, remainingBalance + interest + extraMonthlySpend);
        // Update remaining balance
        remainingBalance = remainingBalance + interest + extraMonthlySpend - totalPayment;
        // Increment month counter
        months++;

        console.log(`Month ${months}: Remaining Balance = $${remainingBalance.toFixed(2)}`);
    }

    return months;
}

function calculateRemainingBalanceOverTime(totalBalance, apr, maxMonthlyPayment, extraMonthlySpend) {
    // Convert APR to monthly periodic rate
    apr /= 100; // Convert percentage to decimal
    let dpr = apr / 365; // Daily periodic rate
    let mpr = dpr * 30; // Monthly periodic rate

    let remainingBalance = totalBalance;
    let months = 0;

    const labels = [];
    const data = [];

    while (remainingBalance > 0) {
        // Calculate interest accrued
        let interest = remainingBalance * mpr;
        // Calculate total payment (minimum payment + extra spend)
        let totalPayment = Math.min(maxMonthlyPayment, remainingBalance + interest + extraMonthlySpend);
        // Update remaining balance
        remainingBalance = remainingBalance + interest + extraMonthlySpend - totalPayment;
        // Increment month counter
        months++;

        // Add data point to labels and data arrays
        labels.push(months);
        data.push(remainingBalance);
    }

    return { labels, data };
}

module.exports = {
    calculateMonthsToPayoff,
    calculateRemainingBalanceOverTime
};
