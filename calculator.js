// calculator.js

function calculateMonthsToPayoff(totalBalance, apr, maxMonthlyPayment, extraMonthlySpend) {
    let remainingBalance = totalBalance;
    let months = 0;

    while (remainingBalance > 0) {
        remainingBalance *= (1 + apr / 12 / 100); // Add monthly interest
        remainingBalance -= maxMonthlyPayment + extraMonthlySpend; // Subtract monthly payment
        months++;
    }

    return months;
}

function calculateRemainingBalanceOverTime(totalBalance, apr, maxMonthlyPayment, extraMonthlySpend) {
    let remainingBalance = totalBalance;
    const labels = [];
    const data = [];

    while (remainingBalance > 0) {
        labels.push(data.length + 1); // Month number
        data.push(remainingBalance); // Remaining balance for the month

        remainingBalance *= (1 + apr / 12 / 100); // Add monthly interest
        remainingBalance -= maxMonthlyPayment + extraMonthlySpend; // Subtract monthly payment
    }

    return { labels, data };
}

module.exports = {
    calculateMonthsToPayoff,
    calculateRemainingBalanceOverTime
};
