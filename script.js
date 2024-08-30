let currentExpression = '';
let resultExpression = '';


function initializeDisplay() {
    const currentDisplay = document.getElementById('currentDisplay');
    const resultDisplay = document.getElementById('resultDisplay');

    currentDisplay.textContent = ' ';
    resultDisplay.textContent = ' ';
}


function updateDisplay() {
    const currentDisplay = document.getElementById('currentDisplay');
    const resultDisplay = document.getElementById('resultDisplay');

    let displayExpression = currentExpression
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/\-/g, '−');

    currentDisplay.textContent = displayExpression;
    const maxDigits = 10;

    const hasOperatorsOrParentheses = /[+\-*/()]/.test(currentExpression);

    if (hasOperatorsOrParentheses) {
        resultDisplay.textContent = resultExpression.toString().slice(0, maxDigits);
    } else {
        resultDisplay.textContent = '';
    }
}

function validateInput(currentExpression, newInput) {
    const testExpression = currentExpression + newInput;

    const invalidPatterns = [
        /^[+*/]|^-{2,}/, // Invalid leading symbols
        /[+*/]{2}|\-{3,}|[+*/\-]\-[+*/]/, //Invalid consecutive operators
        /-[+*/]/, // Invalid operators after subtract
        /[+*/]-{2,}/, // Invalid double subtract after other operator
        /(\d*\.\d*){2,}/, // Prevent multiple decimals in a number
        /\.[+*/-]/, // Prevent operator after a decimal
        /\([+*/]/, // Prevent invalid operators after opening parenthesis
    ];

    for (let pattern of invalidPatterns) {
        if (pattern.test(testExpression)) {
            return false;
        }
    }
    return true;
}


function handleInput(button) {
    if (button.classList.contains('special')) {
        handleSpecialButton(button.id);
    } else if (button.classList.contains('parenthesis')) {
        const newInput = handleParenthesisButton(currentExpression);
        if (validateInput(currentExpression, newInput)) {
            currentExpression += newInput;
        }
    } else {
        const newInput = button.id;
        if (validateInput(currentExpression, newInput)) {
            currentExpression += newInput;
        }
    }
}

function handleSpecialButton(id) {
    switch(id) {
        case 'clear':
            currentExpression = '';
            resultExpression = '';
            break;
        case 'backspace':
            currentExpression = currentExpression.slice(0, -1);
            break;
        case 'evaluate':
            try {
                evaluateExpression();
                currentExpression = resultExpression.toString();
                resultExpression = '';
                break;
            } catch {
                break;
            }
    }
}

function evaluateExpression() {
    try {
        let processedExpression = currentExpression
        .replace(/(\d+|\))\(/g, '$1*(')
        .replace(/\)(\d+)/g, ')*$1')
        .replace(/--/g, '+');

        const openParenCount = (processedExpression.match(/\(/g) || []).length;
        const closeParenCount = (processedExpression.match(/\)/g) || []).length;
        processedExpression += ')'.repeat(openParenCount - closeParenCount);

        resultExpression = eval(processedExpression);
    } catch {
        resultExpression = '';
    }
}

function handleParenthesisButton(currentExpression) {
    const openParenCount = (currentExpression.match(/\(/g) || []).length;
    const closeParenCount = (currentExpression.match(/\)/g) || []).length;

    const lastChar = currentExpression[currentExpression.length - 1] || '';

    const operatorRegex = /[*+-/]/;

    if (currentExpression === '' || operatorRegex.test(lastChar) || lastChar === '(') {
        return '(';
    } else if (openParenCount > closeParenCount && !operatorRegex.test(lastChar)) {
        return ')';
    } else {
        return '(';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initializeDisplay();

    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            handleInput(button);
            if (button.id !== 'evaluate' && currentExpression !== '') {
                evaluateExpression();
            }
            updateDisplay();
        });
    });
});

window.addEventListener('load', function() {
    document.body.style.visibility = 'visible';
});