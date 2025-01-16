const result = document.querySelector(".result"); // Para mostrar o resultado final
const operationDisplay = document.querySelector(".operation"); // Para mostrar os valores digitados
const buttons = document.querySelectorAll(".buttons button");

let currentNumber = "";
let firstOperand = null;
let operator = null;
let restart = false;

function updateResult(originalClear = false) {
    // Atualiza o display do resultado
    result.innerText = originalClear ? 0 : currentNumber.replace(".", ",");
}

function updateOperationDisplay() {
    // Atualiza o display da operação
    if (firstOperand !== null && operator) {
        operationDisplay.innerText = `${firstOperand.toString().replace(".", ",")} ${operator} ${currentNumber.replace(".", ",") || ""}`;
    } else {
        operationDisplay.innerText = currentNumber.replace(".", ",");
    }
}

function addDigit(digit) {
    if (digit === "," && (currentNumber.includes(",") || !currentNumber)) return;

    if (restart) {
        currentNumber = digit;
        restart = false;
    } else {
        currentNumber += digit;
    }

    updateResult();
    updateOperationDisplay();
}

function setOperator(newOperator) {
    if (currentNumber) {
        firstOperand = parseFloat(currentNumber.replace(",", "."));
        currentNumber = "";
    }

    operator = newOperator;
    updateOperationDisplay();
}

function calculate() {
    if (operator === null || firstOperand === null) return;
    let secondOperand = parseFloat(currentNumber.replace(",", "."));
    let resultValue;

    switch (operator) {
        case "+":
            resultValue = firstOperand + secondOperand;
            break;
        case "-":
            resultValue = firstOperand - secondOperand;
            break;
        case "x":
            resultValue = firstOperand * secondOperand;
            break;
        case "÷":
            resultValue = firstOperand / secondOperand;
            break;
        default:
            return;
    }

    if (resultValue.toString().split(".")[1]?.length > 5) {
        currentNumber = parseFloat(resultValue.toFixed(5)).toString();
    } else {
        currentNumber = resultValue.toString();
    }

    operator = null;
    firstOperand = null;
    restart = true;

    // Após o cálculo, mostrar apenas o resultado
    operationDisplay.innerText = ""; // Limpa a operação
    updateResult();
}

function clearCalculator() {
    currentNumber = "";
    firstOperand = null;
    operator = null;
    updateResult(true);
    operationDisplay.innerText = ""; // Limpa o display da operação
}

function setPercentage() {
    let result = parseFloat(currentNumber) / 100;

    if (["+", "-"].includes(operator)) {
        result = result * (firstOperand || 1);
    }

    if (result.toString().split(".")[1]?.length > 5) {
        result = result.toFixed(5).toString();
    }
    currentNumber = result.toString();
    updateResult();
    updateOperationDisplay();
}

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const buttonText = button.innerText;
        if (/^[0-9, ]+$/.test(buttonText)) {
            addDigit(buttonText);
        } else if (["+", "-", "x", "÷"].includes(buttonText)) {
            setOperator(buttonText);
        } else if (buttonText === "=") {
            calculate();
        } else if (buttonText === "C") {
            clearCalculator();
        } else if (buttonText === "±") {
            currentNumber = (
                parseFloat(currentNumber || firstOperand) * -1
            ).toString();
            updateResult();
            updateOperationDisplay();
        } else if (buttonText === "%") {
            setPercentage();
        }
    });
});