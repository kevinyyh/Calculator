function add(a,b) {
    return a+b;
}

function substract(a,b) {
    return a-b;
}

function multiply(a,b) {
    return a*b;
}

function divide(a,b) {
    return a/b;
}

function operate(num1, operator, num2) {
    if (operator === '+') {
        return add(num1, num2);
    }

    if (operator === '-') {
        return substract(num1, num2);
    }

    if (operator === '×') {
        return multiply(num1, num2);
    }

    if (operator === '/') {
        return divide(num1, num2);
    }
}

const buttons = document.querySelectorAll(".button");

let displayArray = [];
const displayElement = document.querySelector("#display");

const allNumbers = document.querySelectorAll(".number");
const allOperators = document.querySelectorAll(".operator");
const dot = document.querySelector("#dot");
const equals = document.querySelector("#equals");
const clear = document.querySelector("#clear");
const del = document.querySelector("#delete");

function enableList(list) {
    for (let ele of list) {
        ele.style.pointerEvents = "auto";
    }
}

function disableList(list) {
    for (let ele of list) {
        ele.style.pointerEvents = "none";
    }
}

function enable(ele) {
    ele.style.pointerEvents = "auto";
}

function disable(ele) {
    ele.style.pointerEvents = "none";
}

function afterClear() {
    enableList(allNumbers);
    disableList(allOperators);
    enable(dot);
    disable(equals);
    enable(clear);
    enable(del);
}

function afterDot() {
    enableList(allNumbers);
    enableList(allOperators);
    disable(dot);
    enable(equals);
    enable(clear);
    enable(del);
}

function afterNumber() {
    enableList(allNumbers);
    enableList(allOperators);
    enable(dot);
    enable(equals);
    enable(clear);
    enable(del);
}

function afterOperator() {
    enableList(allNumbers);
    disableList(allOperators);
    enable(dot);
    disable(equals);
    enable(clear);
    enable(del);
}

function operatorOnly() {
    disableList(allNumbers);
    enableList(allOperators);
    disable(dot);
    disable(equals);
    enable(clear);
    enable(del);
}

function equalsOnly() {
    disableList(allNumbers);
    disableList(allOperators);
    disable(dot);
    enable(equals);
    enable(clear);
    enable(del);
}

function afterCalculation() {
    disableList(allNumbers);
    disableList(allOperators);
    disable(dot);
    disable(equals);
    enable(clear);
    disable(del);
}

let firstNumber = null;
let operatorIndex = null;
let secondNumber = null;
let firstSize = 0;
let secondSize = 0;
const LIMIT = 5;

function validate() {
    if (firstNumber === null) {
        firstSize++;
        if (firstSize === 5) {
            operatorOnly();
        }
    } else {
        secondSize++;
        if (secondSize === 5) {
            equalsOnly();
        }
    }
}

afterClear();

function calculateNumber(displayArray, operatorIndex) {
    let targetArray = null;
    if (operatorIndex === null) {
        targetArray = displayArray;
    } else {
        targetArray = displayArray.slice(operatorIndex+1);
    }
    // console.log(targetArray);
    let left = 0;
    let right = 0;
    let haveDot = false;
    let dividend = 10;
    for (let i = 0; i < targetArray.length; i++) {
        if (targetArray[i] === ".") {
            haveDot = true;
            continue;
        }
        if (!haveDot) {
            left = left * 10 + (+targetArray[i]);
        } else {
            right = right + (+targetArray[i] / dividend);
            dividend *= 10;
        }
    }
    return left + right;
}

for (let button of buttons) {
    button.addEventListener("click", (e) => {
        if (e.target.textContent === "clear") {
            afterClear();
            displayArray = [];
            firstNumber = null;
            operatorIndex = null;
            secondNumber = null;
            firstSize = 0;
            secondSize = 0;
        } else if (e.target.textContent === "del") {
            if (displayArray.length > 0) {
                let pop = displayArray.pop();
            }
            if (displayArray.length === 0) {
                afterClear();
                firstSize = 0;
            } else {
                if (pop === '+' || pop === '-' || pop === '×' || pop === '/') {
                    firstNumber = null;
                    operatorIndex = null;
                } else {
                    if (firstNumber === null) {
                        firstSize--;
                    } else {
                        secondSize--;
                    }
                }
                let last = displayArray[displayArray.length - 1];
                if (+last >= 0 && +last <= 9) {
                    afterNumber();
                } else if (last === ".") {
                    afterDot();
                } else if (last === "+" || last === "-" || last === "×" || last === "/") {
                    afterOperator();
                }
                validate();
            }
        } else if (e.target.textContent === "=") {
            secondNumber = calculateNumber(displayArray, operatorIndex);
            console.log(firstNumber);
            console.log(secondNumber);
            let result = Math.round(operate(firstNumber, displayArray[operatorIndex], secondNumber) * 100) / 100;
            displayElement.textContent = result;
            afterCalculation();
            return;
        } else if (e.target.textContent === ".") {
            displayArray.push(e.target.textContent);
            afterDot();
            validate();
        } else if (e.target.classList.contains("number")) {
            displayArray.push(e.target.textContent);
            afterNumber();
            validate();
        } else if (e.target.classList.contains("operator")) {
            firstNumber = calculateNumber(displayArray, operatorIndex);
            displayArray.push(e.target.textContent);
            operatorIndex = displayArray.length - 1;
            afterOperator();
        }
        displayElement.textContent = display(displayArray);
    });
}

function display(displayArray) {
    let str = "";
    for (let i = 0; i < displayArray.length; i++) {
        str += displayArray[i];
    }
    return str;
}




