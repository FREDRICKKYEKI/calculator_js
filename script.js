const btns = document.querySelectorAll(".calc-btn");
const testsBtn = document.querySelector(".tests-btn");
const closeBtn = document.querySelector(".close-btn");
const resultStatus = document.querySelector(".res-status");
let testStatus = false;
const screen = document.querySelector(".screen span");
const tests = document.querySelector(".tests");
let store = localStorage.getItem("ops");
let memo = store ? JSON.parse(store) : {};
let mem_stack = Array.from(Object.keys(memo));
let currStackPos = 0;
const operands = ["+", "-", "/", "*"];
let ops = [];
let op_str = "0";
const myNewEval = globalThis.newEval;
screen.innerText = op_str;

document.onkeydown = (e) => {
  const key = e.key;
  if (key === "ArrowDown") {
    if (mem_stack.length == 0) return;
    moveCurrPosUp();
    screen.innerText = mem_stack[currStackPos];
    return;
  } else if (key === "ArrowUp") {
    if (mem_stack.length == 0) return;
    moveCurrPosDown();
    screen.innerText = mem_stack[currStackPos];
    return;
  }

  if (key === "Backspace") {
    ops.pop();
    keyIndicator(key);
    updateScreen();
    return;
  }
  if (!isNum(key) && !isOp(key) && !(key === "Enter")) return;
  else {
    performOp(null, key);
    keyIndicator(key);
  }
};

btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    performOp(e);
    btn.blur();
  });
});

/**
 * @param {object} e event emitted on button click
 * @param {string} k key pressed
 */
const performOp = (e, k) => {
  console.log(e == null);
  let op = e != null ? e.target.innerText : k;
  const target = e != null ? e.target.id : 0;

  screen.style = "animation: cursor .38s infinite alternate ease-out;";

  if (target === "op" || isOp(op)) {
    op = " " + op + " ";
  }

  if (op == "=" || op == "Enter") {
    evaluate();
    keyIndicator(op);
  } else if (op === "C") {
    ops.pop();
    updateScreen();
  } else {
    ops.push(op);
    updateScreen();
  }
};
/**
 * Evaluates operation and prints output to screen
 */
const evaluate = () => {
  memo = JSON.parse(localStorage.getItem("ops")) || {};
  screen.style = "animation: unset";
  try {
    if (memo[op_str]) {
      screen.innerHTML = renderer.show(memo[op_str], 1);
      clearOps();
    } else {
      screen.innerHTML = renderer.show(myNewEval(op_str), 1);
      pushMemo(op_str, myNewEval(op_str));
    }
  } catch (e) {
    console.error(e, op_str);
    screen.innerHTML = renderer.show(e, 0);
    clearOps();
  }
};

/**
 * Clears operation from operation Array
 */
const clearOps = () => {
  ops = [];
  op_str = "0";
};

/**
 * Updates screen after any operation
 */
const updateScreen = () => {
  if (ops.length == 0) {
    op_str = "0";
  } else {
    op_str = ops.join("");
  }
  screen.innerText = op_str;
};

/**
 * Pushes string operation to memory operation
 * @param {string} op - string operation
 * @param {string} ans - answer
 */
const pushMemo = (op, ans) => {
  memo[`${op}`] = `${ans}`;
  mem_stack = Array.from(Object.keys(memo));
  currStackPos = mem_stack.length - 1;

  if (mem_stack.length > 10) {
    delete memo[mem_stack[0]];
  }

  localStorage.setItem("ops", JSON.stringify(memo));
  clearOps();
};

/**
 * Error renderer.
 */
const renderer = {
  /**
   * Renders output to the screen
   * @param {string} output output
   * @param {number} type type of output to be rendered
   * (0: error | 1: answer | 3: general render)
   * @returns {string} innerHTML string
   */
  show: (output, type) => {
    switch (type) {
      case 0:
        const err = `${output}`.slice(0, 12);
        return `<span class="error s">${err}</span>`;
      case 1:
        return `<span class="ans"> <span>Ans</span>: ${output}</span>`;
      case 2:
        return `<div class='test'>${output}</div>`;
      default:
    }
  },
};

/**
 * @param {string} c character to be checked
 * @returns {boolean} true if is valid number or decimal point else false
 */
const isNum = (c) => {
  if (c === "." || /^\d+$/.test(c)) return true;
};

/**
 * @param {string} c character to be checked
 * @returns {boolean} true whether is valid operand else false
 */
const isOp = (c) => {
  return operands.includes(c);
};

/**
 * Moves the current memory stack position down
 */
const moveCurrPosDown = () => {
  if (currStackPos <= 0) {
    currStackPos = 0;
  } else currStackPos -= 1;
  op_str = `${mem_stack[currStackPos]}`;
};

/**
 * Moves the current mem stack position up
 */
const moveCurrPosUp = () => {
  if (currStackPos >= mem_stack.length - 1) currStackPos = mem_stack.length - 1;
  else currStackPos += 1;
  op_str = `${mem_stack[currStackPos]}`;
};

/**
 * Clears memory in local storage as well as memory stack
 */
const clearMem = () => {
  localStorage.clear();
  screen.innerHTML = "Memory Cleared";
  memo = {};
  mem_stack = Array.from(Object.keys(memo));
};

/**
 * buttons shimmer on key pressed
 * @param {string} key - key pressed
 */
const keyIndicator = (key) => {
  btns.forEach((btn) => {
    btn.classList.remove("pressed");
    if (btn.innerText == key) {
      btn.classList.add("pressed");
    } else if (btn.innerText == "C" && key == "Backspace") {
      btn.classList.add("pressed");
    } else if (btn.innerText == "=" && key == "Enter") {
      btn.classList.add("pressed");
    } else {
      btn.classList.remove("pressed");
    }
  });
};

testsBtn.addEventListener("click", () => {
  testStatus = !testStatus;
  runTests();
});

closeBtn.addEventListener("click", () => {
  testStatus = !testStatus;
  runTests();
});

function runTests() {
  if (testStatus) {
    tests.innerHTML = globalThis
      .results(myNewEval)
      .map((res) => renderer.show(res, 2))
      .join("\n");
    testsBtn.setAttribute("hidden", "true");
    closeBtn.removeAttribute("hidden");
    resultStatus.removeAttribute("hidden");
  } else {
    tests.innerHTML = "<div></div>";
    testsBtn.removeAttribute("hidden");
    closeBtn.setAttribute("hidden", "true");
    resultStatus.setAttribute("hidden", "true");
  }
}

runTests();
