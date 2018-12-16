(function () {
    if (typeof (window.Tesla) === 'undefined') window.Tesla = {};
    window.Tesla.CalculatorJS = (function () {
        var convertValue = function (value, typeToConvert) {
            try {
                switch (typeToConvert) {
                    case 'number':
                        if (isNaN(value)) throw new DOMException("Not a number");
                        return parseFloat(value);
                    case 'boolean':
                        return (value === 'true' || value === '1' || value === 'yes') ? true : false;
                    default:
                        return value;
                }
            } catch (ex) {
                if (console) console.error('Exception converting value: ' + value + ' to type: ' + typeToConvert);
                return null;
            }
        };

        var setVariableValue = function (name, value) {
            if (typeof (variables[name]) !== 'undefined') {
                var convertedValue = convertValue(value, typeof (variables[name]));
                if (typeof (convertedValue) === typeof (variables[name])) {
                    variables[name] = convertedValue;
                    return true;
                }
                else {
                    if (console) console.error("Failed to set value for attribute: \"" + name + "\". Not a valid value.");
                    return false;
                }
            } else {
                if (console) console.error("Failed to set value for attribute: \"" + name + "\". Attribute is not available or the value is not valid.");
                return false;
            }
        }

        var variables = {"estMonthlyPrice":0.0,"interestRate":4.2,"interestAmount":0.0,"interest":0.0,"vehiclePrice":35000.0,"financeType":"loan","downPayment":5000.0,"tradeInValue":0.0,"loanTermInMonths":48,"leaseTermInMonths":48}
        var get = function (name) { return variables[name]; };
        var set = function (name, value) {
            if (setVariableValue(name, value) === true) {
                calculate();
            }
        };

        var getObject = function () { return variables; };
        var setObject = function (values) {
            for (var attribute in values) {
                setVariableValue(attribute, values[attribute]);
            }
            calculate();
        };

        var calculator = {
            finalAmount: 0,
            rulesObj: {"loan":[{"calculatorRuleId":1,"countryCode":"US","stateCode":null,"modelCode":null,"loanType":"loan","sortOrder":1,"leftHandSide":"estMonthlyPrice","firstArgument":"vehiclePrice","operator":"-","secondArgument":"tradeInValue","enabled":true},{"calculatorRuleId":2,"countryCode":"US","stateCode":null,"modelCode":null,"loanType":"loan","sortOrder":2,"leftHandSide":"intereset","firstArgument":"interestRate","operator":"/","secondArgument":"100","enabled":true},{"calculatorRuleId":3,"countryCode":"US","stateCode":null,"modelCode":null,"loanType":"loan","sortOrder":3,"leftHandSide":"interestAmount","firstArgument":"estMonthlyPrice","operator":"*","secondArgument":"intereset","enabled":true},{"calculatorRuleId":4,"countryCode":"US","stateCode":null,"modelCode":null,"loanType":"loan","sortOrder":4,"leftHandSide":"estMonthlyPrice","firstArgument":"estMonthlyPrice","operator":"+","secondArgument":"interestAmount","enabled":true},{"calculatorRuleId":10,"countryCode":"US","stateCode":null,"modelCode":null,"loanType":"loan","sortOrder":5,"leftHandSide":"estMonthlyPrice","firstArgument":"estMonthlyPrice","operator":"/","secondArgument":"loanTermInMonths","enabled":true}],"lease":[{"calculatorRuleId":5,"countryCode":"US","stateCode":null,"modelCode":null,"loanType":"lease","sortOrder":1,"leftHandSide":"estMonthlyPrice","firstArgument":"vehiclePrice","operator":"-","secondArgument":"tradeInValue","enabled":true},{"calculatorRuleId":6,"countryCode":"US","stateCode":null,"modelCode":null,"loanType":"lease","sortOrder":2,"leftHandSide":"interest","firstArgument":"interestRate","operator":"/","secondArgument":"100","enabled":true},{"calculatorRuleId":7,"countryCode":"US","stateCode":null,"modelCode":null,"loanType":"lease","sortOrder":3,"leftHandSide":"interestAmount","firstArgument":"estMonthlyPrice","operator":"*","secondArgument":"interest","enabled":true},{"calculatorRuleId":8,"countryCode":"US","stateCode":null,"modelCode":null,"loanType":"lease","sortOrder":4,"leftHandSide":"estMonthlyPrice","firstArgument":"estMonthlyPrice","operator":"+","secondArgument":"interestAmount","enabled":true},{"calculatorRuleId":9,"countryCode":"US","stateCode":null,"modelCode":null,"loanType":"lease","sortOrder":5,"leftHandSide":"estMonthlyPrice","firstArgument":"estMonthlyPrice","operator":"/","secondArgument":"leaseTermInMonths","enabled":true}]}
        };

        var calculate = function() {
            for (var i = 0; i < calculator.rulesObj[variables["financeType"]].length; i++) {
                var currentRule = calculator.rulesObj[variables["financeType"]][i];
                var arg1 = (isNaN(parseFloat(currentRule.firstArgument)) ? variables[currentRule.firstArgument] : parseFloat(currentRule.firstArgument));
                var arg2 = (isNaN(parseFloat(currentRule.secondArgument)) ? variables[currentRule.secondArgument] : parseFloat(currentRule.secondArgument));
                switch (currentRule.operator) {
                    case "*":
                        variables[currentRule.leftHandSide] = arg1 * arg2;
                        break;
                    case "+":
                        variables[currentRule.leftHandSide] = arg1 + arg2;
                        break;
                    case "-":
                        variables[currentRule.leftHandSide] = arg1 - arg2;
                        break;
                    case "/":
                        variables[currentRule.leftHandSide] = arg1 / arg2;
                        break;
                    case "%":
                        variables[currentRule.leftHandSide] = arg1 % arg2;
                        break;
                }
            }
            try {
                document.getElementById('finalAmount').innerHTML = variables.estMonthlyPrice;
            } catch (ex) { }
        }

        return {
            CalculateValue: calculate,
            get: get,
            set: set,
            setObject: setObject,
            getObject: getObject
        }
    })();
})();