const errors = {
  INVALID_EXPRESSION: "Invalid Expression!!!",
  EXPRESSION_NOT_FOUND: "No expression found!!!",
};

const signs = ["/", "*", "+", "-"];

const evals = {
  "/": (a, b) => a / b,
  "*": (a, b) => a * b,
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
};

/**
 * Evaluates mathematical expression
 * @param {String | null} exp  expression
 * @returns output (answer)
 */
function newEval(exp = null) {
  if (!exp) return 0;
  let ans = exp.replace(/\s+/g, "");
  let i = 0;

  while (true) {
    if (i >= signs.length) break;

    if (String(ans).includes(signs[i]) && !matches(ans)) {
      ans = calculate(ans, signs[i]);
    } else i++;
  }
  /* end of loop */
  if (ans == exp && !matches(ans)) {
    ans = undefined;
    throw SyntaxError(errors.INVALID_EXPRESSION);
  }

  return ans;
}
/**
 * matches positive/negative number (answer)
 * @param {String} exp
 * @returns {bool} true | false
 */
function matches(exp) {
  const regex = /^[-|+](\d+(\.\d+)?)$/;
  return regex.test(exp);
}

/**
 * Calculates the output of mathematical expression
 * @param {String} exp expression
 * @param {String} sign operand
 * @returns {String} answer
 */
function calculate(exp, sign) {
  exp = String(exp);
  let splitExp = exp.match(/(\d+(\.\d+)?|\D)/g);
  let i = splitExp.findIndex((x) => x == sign);
  let a = parseFloat(splitExp[i - 1] || 0);
  let b = parseFloat(splitExp[i + 1]);
  let answer;
  let newSign = sign;

  /*if a is positive*/
  if (a && !splitExp[i - 2]) {
    a = parseFloat("+" + splitExp[i - 1]);
  } else if (a && splitExp[i - 2] == "-" && !splitExp[i - 3]) {
    /*If a is negative and no number before the negative*/
    a = parseFloat("-" + splitExp[i - 1]);
  } else if (a && splitExp[i - 2] == "-") {
    /*If a is simply negative */
    if (newSign == "+" && splitExp[i - 3]) {
      a = parseFloat("+" + splitExp[i - 3]);
      b = parseFloat("-" + splitExp[i - 1]);
      answer = String(evals["+"](a, b));
      return [answer, "+", ...splitExp.slice(i + 1)].join("");
    } else {
      a = parseFloat("-" + splitExp[i - 1]);
    }
  }

  // if sign is - and next is -
  if (sign == "-" && splitExp[i + 1] == "-") {
    newSign = "+";
    let j = 0;
    // if it index contains sign move
    while (signs.includes(splitExp[i + j])) j++;
    if (j % 2 == 0) newSign = "+";
    else newSign = "-";
    b = parseFloat(splitExp[i + j]);
    return evals[newSign](a, b);
  } else if (signs.includes(splitExp[i + 1])) {
    b = parseFloat(splitExp[i + 1] + splitExp[i + 2]);
    return evals[newSign](a, b);
  }

  // check a and b before calculating
  if (!validExp(a, b)) {
    throw SyntaxError(errors.INVALID_EXPRESSION);
  }
  answer = String(evals[newSign](a, b));

  if (matches(answer) && splitExp.length > 3) {
    splitExp.splice(i - 2, 4, answer);
  } else splitExp.splice(i - 1, 3, answer);
  //negative total answer (e.g -2342)
  if (matches(splitExp.join(""))) return answer;

  return splitExp.join("");
}

function validExp(a, b) {
  let isValid = true;

  if (a == undefined || b == undefined) isValid = false;
  else if (Number.isNaN(a) || Number.isNaN(b)) isValid = false;

  return isValid;
}

window.newEval = newEval;
