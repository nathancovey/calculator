class Calculator {
    constructor() {
      this.display = document.querySelector('.display');
      this.currentValue = '0';
      this.previousValue = null;
      this.operator = null;
      this.newNumber = true;

      document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => this.handleButton(button.textContent));
      });
    }

    handleButton(value) {
      if (value.match(/[0-9.]/)) {
        this.handleNumber(value);
      } else if (value.match(/[+\-×÷]/)) {
        this.handleOperator(value);
      } else if (value === '=') {
        this.calculate();
      } else if (value === 'Clear') {
        this.clear();
      } else if (value === '←') {
        this.backspace();
      }
    }

    handleNumber(num) {
      if (this.newNumber) {
        this.currentValue = num === '.' ? '0.' : num;
        this.newNumber = false;
      } else {
        if (num === '.' && this.currentValue.includes('.')) return;
        this.currentValue += num;
      }
      this.updateDisplay();
    }

    handleOperator(op) {
      if (this.operator && !this.newNumber) {
        this.calculate();
      }
      this.previousValue = this.currentValue;
      this.operator = op;
      this.newNumber = true;
    }

    calculate() {
      if (!this.operator || !this.previousValue || this.newNumber) return;

      const prev = parseFloat(this.previousValue);
      const current = parseFloat(this.currentValue);
      let result;

      switch (this.operator) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '×':
          result = prev * current;
          break;
        case '÷':
          if (current === 0) {
            this.clear();
            this.currentValue = 'Error';
            this.updateDisplay();
            return;
          }
          result = prev / current;
          break;
      }

      this.currentValue = parseFloat(result.toFixed(8)).toString();
      this.operator = null;
      this.newNumber = true;
      this.updateDisplay();
    }

    clear() {
      this.currentValue = '0';
      this.previousValue = null;
      this.operator = null;
      this.newNumber = true;
      this.updateDisplay();
    }

    backspace() {
      if (this.newNumber) return;
      this.currentValue = this.currentValue.slice(0, -1);
      if (this.currentValue === '' || this.currentValue === '-') {
        this.currentValue = '0';
        this.newNumber = true;
      }
      this.updateDisplay();
    }

    updateDisplay() {
      this.display.textContent = this.currentValue;
    }
  }

  new Calculator();