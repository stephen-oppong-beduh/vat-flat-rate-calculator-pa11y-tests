'use strict'

const pa11y = require('pa11y');
const colors = require('colors');

main();

async function main() {
    const baseUrl = 'http://localhost:9080/check-your-vat-flat-rate';
    const vatReturnPeriodLink = `${baseUrl}/vat-return-period`;
    const turnoverLink = `${baseUrl}/turnover`;
    const costOfGoodsLink = `${baseUrl}/cost-of-goods`;
    const resultLink = `${baseUrl}/result`;

    const entryLink = vatReturnPeriodLink;

    try {
        const vatReturnPeriodOptions = {};

        const turnoverOptions = {
            "actions": [
                'check field #vatReturnPeriod-annually',
                'click button.button',
                `wait for url to be ${turnoverLink}`
            ]
        };

        const costOfGoodsOptions = {
            "actions": [
                'wait for element #turnover to be visible',
                'set field #turnover to 3',
                'click button.button',
                `wait for url to be ${costOfGoodsLink}`
            ]
        };

        const resultOptions = {
            "actions": [
                'wait for element #costOfGoods to be visible',
                'set field #costOfGoods to 3',
                'click button.button',
                `wait for url to be ${resultLink}`
            ]
        };

        costOfGoodsOptions.actions = turnoverOptions.actions.concat(costOfGoodsOptions.actions);

        resultOptions.actions = costOfGoodsOptions.actions.concat(resultOptions.actions);

        const results = await Promise.all([
            pa11y(entryLink, vatReturnPeriodOptions),
            pa11y(entryLink, turnoverOptions),
            pa11y(entryLink, costOfGoodsOptions),
            pa11y(entryLink, resultOptions)
        ]);

        printResults(results);

    } catch(error) {
        console.error(error.message);
    }

    function printResults(resultsList) {
        console.log();
        resultsList.forEach(printResult);

        function printResult(result) {
            const pageUrl = result.pageUrl
            const border = "=".repeat(pageUrl.length)
            console.log(border);
            console.log(pageUrl);
            console.log(border);
            if(result.issues.length == 0) {
                console.log(result);
            } else {
                result.issues.forEach((issue) => {
                    console.log();
                    console.log(`${showStatus(issue.typeCode)}:`);
                    console.log(`\tcode    : ${issue.code}`);
                    console.log(`\tmessage : ${issue.message}`);
                    console.log(`\tselector: ${issue.selector}`);
                });
            }
        }

        function showStatus(typeCode) {
            switch(typeCode) {
                case 1: return 'Error'.red;
                case 2: return 'Warning'.yellow;
                case 3: return 'Notice'.cyan;
                default: return 'Undefined'.gray;
            }
        }

    }
}

