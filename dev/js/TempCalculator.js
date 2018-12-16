import _set from 'lodash/set'
import _forOwn from 'lodash/forOwn'
import _omit from 'lodash/omit'
/**
 * Temporary Lease / Loan calculator until someone builds the 'real' one
 * We all know that temporary usually means 'permanent', but I stripped this down to nothing
 * so it can't really be that 
 */
const formulas = {
    round: function(value, decimal) {
        var roundTo = Math.pow(10, decimal || 0);
        return (Math.round(value * roundTo) / roundTo)
    },
    PMT: function(rate, nper, pv, fv, type) {
        if (!fv) fv = 0;
        if (!type) type = 0;

        if (rate == 0) return -(pv + fv) / nper;

        var pvif = Math.pow(1 + rate, nper);
        var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

        if (type == 1) {
            pmt /= (1 + rate);
        }

        return pmt;
    }
}

// NOTE: This calculator is for US only
class Calculator {

    constructor(props) {
        // do something?
    }

    calculatePayment(params) {
        const {
            financeType
        } = params

        if (financeType === 'loan') {
            return this.calcLoan(_omit(params, ['financeType']))
        }
        else {
            // using loan calc for now because lease is broken
            return this.calcLoan(_omit(params, ['financeType']))
        }
    }

    /**
     * Loan Calculation for US
     * @param  {Number} options.totalDiscounts [description]
     * @param  {Number} options.totalFees      [description]
     * @param  {[type]} options.downPayment    [description]
     * @param  {[type]} options.monthlyPayment [description]
     * @param  {[type]} options.interestRate   [description]
     * @param  {[type]} options.termInMonths   [description]
     * @param  {[type]} options.vehiclePrice   [description]
     * @return {[type]}                        [description]
     */
    calcLoan(params = {}) {
        const {
            // referral discount, showroom discount, etc...
            totalDiscounts = 0,
                // taxes, reg fees, etc...
                totalFees = 0,
                // if there is a tradeIn, please roll into downPayment
                downPayment,
                // only present if you are allowing user to enter their own desired monthlyPayment
                monthlyPayment = null,
                interestRate,
                termInMonths,
                vehiclePrice
        } = params

        _forOwn(params, (v, k) => {
            if (isNaN(v)) {
                console.error('calcLoan requires', k, 'to be a valid number');
            }
        });

        const {
            PMT,
            round
        } = formulas;

        // Calc monthly interest rate
        const monthlyInterestRate = (interestRate / 100) / 12;
        // vehicle price is tabulated differently for different countries
        const adjustedVehiclePrice = vehiclePrice + totalDiscounts;
        // Using total price of the car
        const grossPrice = adjustedVehiclePrice + totalFees;
        // Get total amount financed
        // downPayment = downPayment + tradeInAmount (if relevant)
        const financedAmount = Math.round(grossPrice - downPayment);
        // Calculate the monthly loan payment
        const normalizedMonthlyPayment = monthlyPayment ? monthlyPayment : round(PMT(monthlyInterestRate, termInMonths, -financedAmount), 0);
        // TODO: Verify amount due at signing. Currently we roll fees into the 
        // monthly payment, but the UI indicates that they are due upfront
        const amountDueAtSigning = Math.round(downPayment + totalFees);

        const result = {
            amountDueAtSigning,
            financedAmount,
            interestRate,
            grossPrice,
            monthlyPayment: normalizedMonthlyPayment,
            monthlyInterestRate,
            downPayment
        };

        // returning result sorted by key for friendlier response
        return result;
    }
    
    /**
     * Lease Calculation for US
     * @param  {Number} options.totalDiscounts [description]
     * @param  {Number} options.totalFees      [description]
     * @param  {[type]} options.downPayment    [description]
     * @param  {[type]} options.distance       [description]
     * @param  {[type]} options.interestRate   [description]
     * @param  {[type]} options.loanTerm       [description]
     * @param  {[type]} options.vehiclePrice   [description]
     * @return {[type]}                        [description]
     */
    calcLease({
        totalDiscounts = 0,
        totalFees = 0,
        fees,
        downPayment,
        distance,
        interestRate,
        termInMonths,
        vehiclePrice,
        incentivesTotal,
        residualValueRate,
        taxRate
    }) {

        /// NOTE THIS IS NOT YET WORKING! Need to normalize lease terms
        const monthlyInterestRate = (interestRate / 100) / 12;

        //Get the total price of the vehicle
        const adjustedVehiclePrice = vehiclePrice - totalDiscounts;
        const grossPrice = adjustedVehiclePrice + totalFees;
        const leasedAmount = grossPrice - downPayment;

        const residualValue = grossPrice * residualValueRate + incentivesTotal;
        const roundedResidualValue = Math.round(residualValue * 100) / 100;
        const principalPayment = (leasedAmount - roundedResidualValue) / termInMonths;
        const roundedPrincipalPayment = Math.round(principalPayment * 100) / 100;
        const interestPayment = (leasedAmount + roundedResidualValue) * (monthlyInterestRate / 2);
        const roundedInterestPayment = Math.round(interestPayment * 100) / 100;
        const taxPaidOnLease = (roundedPrincipalPayment + roundedInterestPayment) * taxRate;
        const roundedTaxPaidOnLease = Math.round(taxPaidOnLease * 100) / 100;

        //Tax for downpayment and Acquisition Fee
        const taxOnDownAndAcqFee = (downPayment + fees.acquisitionFee) * taxRate;
        const roundedTaxOnDownAndAcqFee = Math.round(taxOnDownAndAcqFee * 100) / 100;

        const monthlyPayment = Math.round((roundedPrincipalPayment + roundedInterestPayment + roundedTaxPaidOnLease) * 100) / 100;
        const amountDueAtSigning = Math.round((monthlyPayment + roundedTaxOnDownAndAcqFee + downPayment + totalFees) * 100) / 100;

        return {
            amountDueAtSigning,
            interestRate,
            grossPrice,
            monthlyPayment,
            monthlyInterestRate,
            downPayment
        };
    }
}

_set(window, 'Tesla.TempCalculator', new Calculator())