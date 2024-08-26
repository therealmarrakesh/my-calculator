function initializeDisplay() {
    displayValue = '';
    updateDisplay();
}

function updateDisplay() {
    const displayElement = document.querySelector('.display');
    displayElement.textContent = displayValue || ' ';
    displayElement.classList.add('blinking-cursor');
}

document.addEventListener('DOMContentLoaded', function() {
    initializeDisplay();

    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            handleButtonClick(this.textContent);
        });
    });
});

function handleButtonClick(value) {
    if (value === 'AC') {
        displayValue = '';
    } else if (value === '.' && displayValue.includes('.')) {
        return;
    } else {
        displayValue += value;
    }
    updateDisplay();
}