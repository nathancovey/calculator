 // Make sure audio context is created on user interaction
 let audioCtx = null;

 function playPartySound() {
   if (!audioCtx) {
     audioCtx = new (window.AudioContext || window.webkitAudioContext)();
   }
   
   const oscillator = audioCtx.createOscillator();
   const gainNode = audioCtx.createGain();
   
   oscillator.connect(gainNode);
   gainNode.connect(audioCtx.destination);
   
   oscillator.type = 'sine';
   oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
   oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // Slide to A5
   
   gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
   gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
   
   oscillator.start();
   oscillator.stop(audioCtx.currentTime + 0.2);
 }

 class Calculator {
   constructor() {
     this.display = document.querySelector('.display');
     this.currentValue = '0';
     this.previousValue = null;
     this.operator = null;
     this.newNumber = true;

     document.querySelectorAll('button').forEach(button => {
       if (button.classList.contains('party-button')) {
         button.addEventListener('click', () => {
           // Play sound
           playPartySound();
           
           // Launch confetti
           confetti({
             particleCount: 100,
             spread: 70,
             origin: { y: 0.7 },
             colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
           });
         });
       } else {
         button.addEventListener('click', () => this.handleButton(button.textContent));
       }
     });
   }

   // Rest of your calculator code remains the same
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

 // Initialize calculator
 new Calculator();