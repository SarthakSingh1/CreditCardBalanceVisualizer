// calculator.js

function calculateMonthsToPayoff(totalBalance, apr, maxMonthlyPayment, extraMonthlySpend) {
    // Convert APR to monthly periodic rate
    apr /= 100; // Convert percentage to decimal
    let dpr = apr / 365; // Daily periodic rate
    let mpr = dpr * 30; // Monthly periodic rate

    let remainingBalance = totalBalance;
    let months = 0;
    let totalInterest = 0;
    let totalPayments = 0;
    let curr_total_balance = totalBalance; 
    const princpial_data = [];
    const interest_data = [];
    const balance_over_time = [];


    while (remainingBalance > 0) {
        // Calculate interest accrued
        let interest = remainingBalance * mpr;
        totalInterest += interest;

        // Calculate total payment (minimum payment + extra spend)
        let totalPayment = Math.min(maxMonthlyPayment, remainingBalance + interest + extraMonthlySpend);
        totalPayments += totalPayment;
        // Update remaining balance
        let old_balance = remainingBalance; 
        remainingBalance = remainingBalance + interest + extraMonthlySpend - totalPayment;
        if(remainingBalance > old_balance) {
            console.log("Impossible to every pay off card");
            return {"months":0,
                    "interest_data": [],
                    "princpial_data": [],
                    "totalInterest": 0,
                    "totalPrincipal": 0,
                    "balance_over_time": []
        };
        }

        // Increment month counter
        months++;

        // console.log(`Month ${months}: Remaining Balance = $${remainingBalance.toFixed(2)}`);
        interest_data.push(interest);
        princpial_data.push(totalPayment - interest);
        curr_total_balance -= (totalPayment - interest - extraMonthlySpend);
        balance_over_time.push(curr_total_balance);
    }
    let totalPrincipal = totalPayments - totalInterest;

    return { months, interest_data, princpial_data, totalInterest, totalPrincipal, balance_over_time };
}

module.exports = {
    calculateMonthsToPayoff
};
