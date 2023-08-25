#!/usr/bin/node
const testCases = [
  // Basic arithmetic operations
  { input: "3+5", expected: "8" },
  { input: "10-7", expected: "3" },
  { input: "4*6", expected: "24" },
  { input: "15/3", expected: "5" },
  { input: "+5", expected: "+5" },
  { input: "5-1+2", expected: "6" },

  // Decimals and complex expressions
  { input: "3.14*2", expected: "6.28" },
  { input: "1+2*3", expected: "7" },
  { input: "5+3/2", expected: "6.5" },

  // Handling of spaces
  { input: "  10  + 5 ", expected: "15" },

  // Division by zero
  { input: "8/0", expected: "Infinity" },
  { input: "5/0", expected: "Infinity" },

  // undefineds
  { input: "2+", expected: undefined },
  { input: "7/", expected: undefined },
  { input: "1+2*3+", expected: undefined },

  // Handling of different operators
  { input: "3+4-2*2/2", expected: "5" },

  // Negative numbers
  { input: "-5+7", expected: "2" },
  { input: "5*-3", expected: "-15" },

  // More complex expressions without parentheses
  { input: "3+5*2", expected: "13" },
  { input: "6/3-1", expected: "1" },
  { input: "4*5+8/2", expected: "24" },
  { input: "12-6/2", expected: "9" },

  // Mixed operators
  { input: "10-3*2+5/2", expected: "6.5" },
  { input: "8/2*4-1", expected: "15" },
  { input: "2*7-2+5+2", expected: "19" },

  // Handling of spaces
  { input: "  7 + 4 * 3 ", expected: "19" },

  // undefined
  { input: "3+", expected: undefined },
  { input: "9/", expected: undefined },
  { input: "4.5+*2", expected: undefined },

  // Complex expressions
  { input: "3+4*2-6/3", expected: "9" },

  // Negative numbers
  { input: "-3+5", expected: "2" },
  { input: "3-5", expected: "-2" },
  { input: "-5", expected: "-5" },

  // More decimals
  { input: "3.14*2.5+1.5/2", expected: "8.600000000000001" },
];

const statusType = {
  PASS: "PASSED✅",
  FAIL: "FAILED❌",
};

function runCalculatorTests(calculatorFunction) {
  const results = { passed: [], failed: [] };
  let result, status, success;
  let textRes,
    textRes2,
    resArr = [];
  resArr.push(`<h2 style='text-align: center'>Tests</h2>`);
  for (const testCase of testCases) {
    const { input, expected } = testCase;

    try {
      result = calculatorFunction(input);
      status = result == expected ? statusType.PASS : statusType.FAIL;
    } catch (e) {
      result = undefined;
      status = result == expected ? statusType.PASS : statusType.FAIL;
    }

    if (status === statusType.PASS) {
      results.passed.push(testCase);
    } else if (status === statusType.FAIL) {
      results.failed.push({ ...testCase, got: result });
    }
    textRes = `<div><span class="ans">Test</span>: <span class="status">${input}</span></div>
               <div><span class="ans">Expected</span>: <span class="status">${expected}</span></div>
               <div><span class="ans">Got</span>: <span class="status">${result}</span></div>
               <div><span class="ans">Status</span>: <span class="status">${status}</span></div>`;
    resArr.push(textRes);
  }

  success = Math.round((results.passed.length / testCases.length) * 100, 4);
  textRes2 = `\nPassed ${results.passed.length}/${testCases.length} tests`;
  document.querySelector(".res-status").innerHTML = `<h4>${textRes2}</h4>`;

  resArr.push(`<h3>${success}%</h3>`);
  if (success != 100) {
    console.log("\nThe following tests are failing\n:", results.failed);
  }
  return resArr;
}

window.results = runCalculatorTests;
