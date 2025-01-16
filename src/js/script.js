const result = document.querySelector(".result"); // Para mostrar o resultado final
const operationDisplay = document.querySelector(".operation"); // Para mostrar os valores digitados
const buttons = document.querySelectorAll(".buttons button");
const toggleButton = document.querySelector("#mode-toggle"); // Botão para alternar entre claro e escuro

let currentNumber = "";
let firstOperand = null;
let operator = null;
let restart = false;

// Função para atualizar o display do resultado
function updateResult(originalClear = false) {
    result.innerText = originalClear ? 0 : currentNumber.replace(".", ",");
}

// Função para atualizar o display da operação
function updateOperationDisplay() {
    if (firstOperand !== null && operator) {
        operationDisplay.innerText = `${firstOperand.toString().replace(".", ",")} ${operator} ${currentNumber.replace(".", ",") || ""}`;
    } else {
        operationDisplay.innerText = currentNumber.replace(".", ",");
    }
}

// Função para adicionar dígitos ao display
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

// Função para definir o operador
function setOperator(newOperator) {
    if (currentNumber) {
        firstOperand = parseFloat(currentNumber.replace(",", "."));
        currentNumber = "";
    }

    operator = newOperator;
    updateOperationDisplay();
}

// Função para calcular o resultado
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

// Função para limpar a calculadora
function clearCalculator() {
    currentNumber = "";
    firstOperand = null;
    operator = null;
    updateResult(true);
    operationDisplay.innerText = ""; // Limpa o display da operação
}

// Função para calcular o percentual
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

// Função para alternar entre o modo claro e escuro
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains("light-mode")) {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        toggleButton.innerText = "Modo Claro"; // Atualiza o texto do botão
    } else {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        toggleButton.innerText = "Modo Escuro"; // Atualiza o texto do botão
    }
}

// Adicionando o ouvinte para alternar o tema
toggleButton.addEventListener("click", toggleTheme);

// Adicionando os ouvintes de eventos para os botões
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