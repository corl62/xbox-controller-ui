// Xbox Controller Input Handler - Gamepad API Integration

class XboxControllerUI {
    constructor() {
        this.gamepad = null;
        this.outputLog = [];
        this.maxLogLines = 10;
        this.animationFrameId = null;
        this.previousButtonState = {};
        this.skin = 'default';
        
        this.elements = {
            dpadUp: document.querySelector('[data-button="dpad-up"]'),
            dpadDown: document.querySelector('[data-button="dpad-down"]'),
            dpadLeft: document.querySelector('[data-button="dpad-left"]'),
            dpadRight: document.querySelector('[data-button="dpad-right"]'),
            y: document.querySelector('[data-button="y"]'),
            x: document.querySelector('[data-button="x"]'),
            b: document.querySelector('[data-button="b"]'),
            a: document.querySelector('[data-button="a"]'),
            lb: document.querySelector('[data-button="lb"]'),
            rb: document.querySelector('[data-button="rb"]'),
            lt: document.querySelector('[data-button="lt"]'),
            rt: document.querySelector('[data-button="rt"]'),
            menu: document.querySelector('[data-button="menu"]'),
            view: document.querySelector('[data-button="view"]'),
            xbox: document.querySelector('[data-button="xbox"]'),
            leftStick: document.getElementById('leftStick'),
            rightStick: document.getElementById('rightStick'),
            leftStickClick: document.querySelector('[data-button="left-stick-click"]'),
            rightStickClick: document.querySelector('[data-button="right-stick-click"]'),
            outputDisplay: document.getElementById('outputDisplay'),
        };
        
        this.init();
    }
    
    init() {
        this.setupGamepadListener();
        this.setupMouseControls();
        this.setupKeyboardControls();
        this.setupSkinSelector();
        this.addOutput('Xbox Controller Ready!');
        this.addOutput('Connect an Xbox controller or use mouse/keyboard...');
    }
    
    setupGamepadListener() {
        window.addEventListener('gamepadconnected', (e) => {
            this.gamepad = e.gamepad;
            this.addOutput(`✓ ${e.gamepad.id} Connected!`);
            this.pollGamepad();
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            this.addOutput(`✗ ${e.gamepad.id} Disconnected!`);
            this.gamepad = null;
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
        });
    }
    
    pollGamepad() {
        const gp = navigator.getGamepads()[0];
        if (!gp) {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
            return;
        }
        
        this.updateFromGamepad(gp);
        this.animationFrameId = requestAnimationFrame(() => this.pollGamepad());
    }
    
    updateFromGamepad(gp) {
        // D-Pad (buttons 12-15)
        this.updateButtonState('dpadUp', gp.buttons[12], 'D-PAD UP');
        this.updateButtonState('dpadDown', gp.buttons[13], 'D-PAD DOWN');
        this.updateButtonState('dpadLeft', gp.buttons[14], 'D-PAD LEFT');
        this.updateButtonState('dpadRight', gp.buttons[15], 'D-PAD RIGHT');
        
        // Action buttons (buttons 0-3: A, B, X, Y)
        this.updateButtonState('a', gp.buttons[0], 'Button A');
        this.updateButtonState('b', gp.buttons[1], 'Button B');
        this.updateButtonState('x', gp.buttons[2], 'Button X');
        this.updateButtonState('y', gp.buttons[3], 'Button Y');
        
        // Bumpers (buttons 4-5)
        this.updateButtonState('lb', gp.buttons[4], 'LB Bumper');
        this.updateButtonState('rb', gp.buttons[5], 'RB Bumper');
        
        // Triggers (buttons 6-7) - also axes 2 and 5
        this.updateTrigger('lt', gp.buttons[6], gp.axes[2], 'LT Trigger');
        this.updateTrigger('rt', gp.buttons[7], gp.axes[5], 'RT Trigger');
        
        // Stick clicks (buttons 10-11)
        this.updateButtonState('leftStickClick', gp.buttons[10], 'L3 (Left Stick Click)');
        this.updateButtonState('rightStickClick', gp.buttons[11], 'R3 (Right Stick Click)');
        
        // Menu buttons (buttons 8-9)
        this.updateButtonState('view', gp.buttons[8], 'View');
        this.updateButtonState('menu', gp.buttons[9], 'Menu');
        
        // Xbox button (button 16)
        if (gp.buttons[16]) {
            this.updateButtonState('xbox', gp.buttons[16], 'Xbox Button');
        }
        
        // Analog sticks (axes 0-1: left, axes 2-3: right)
        this.updateStickPosition('leftStick', gp.axes[0], gp.axes[1], 'Left Stick');
        this.updateStickPosition('rightStick', gp.axes[2], gp.axes[3], 'Right Stick');
    }
    
    updateButtonState(elementKey, button, name) {
        const element = this.elements[elementKey];
        if (!element) return;
        
        const isPressed = button.pressed;
        const wasPressed = this.previousButtonState[elementKey];
        
        if (isPressed && !wasPressed) {
            this.addOutput(`[${this.getTime()}] ${name} PRESSED`);
            element.classList.add('pressed');
        } else if (!isPressed && wasPressed) {
            this.addOutput(`[${this.getTime()}] ${name} RELEASED`);
            element.classList.remove('pressed');
        }
        
        this.previousButtonState[elementKey] = isPressed;
    }
    
    updateTrigger(elementKey, button, axis, name) {
        const element = this.elements[elementKey];
        if (!element) return;
        
        // Normalize axis value (0 to 1)
        const value = Math.max(0, (axis + 1) / 2);
        const percentage = Math.round(value * 100);
        
        const isPressed = button.pressed || value > 0.1;
        const wasPressed = this.previousButtonState[elementKey];
        
        if (isPressed && !wasPressed) {
            this.addOutput(`[${this.getTime()}] ${name} PRESSED (${percentage}%)`);
            element.classList.add('pressed');
        } else if (!isPressed && wasPressed) {
            this.addOutput(`[${this.getTime()}] ${name} RELEASED`);
            element.classList.remove('pressed');
        }
        
        // Update visual representation
        if (percentage > 0) {
            element.style.opacity = Math.min(1, 0.3 + (percentage / 100) * 0.7);
        } else {
            element.style.opacity = '1';
        }
        
        this.previousButtonState[elementKey] = isPressed;
    }
    
    updateStickPosition(elementKey, axisX, axisY, name) {
        const stickElement = this.elements[elementKey];
        if (!stickElement) return;
        
        const stickInner = stickElement.querySelector('.stick-inner');
        const maxRadius = 40;
        
        // Apply deadzone
        const deadzone = 0.15;
        const adjustedX = Math.abs(axisX) > deadzone ? axisX : 0;
        const adjustedY = Math.abs(axisY) > deadzone ? axisY : 0;
        
        const posX = adjustedX * maxRadius;
        const posY = adjustedY * maxRadius;
        
        stickInner.style.transform = `translate(${posX}px, ${posY}px)`;
        
        const stickX = Math.round(adjustedX * 100);
        const stickY = Math.round(adjustedY * 100);
        
        if (stickX !== 0 || stickY !== 0) {
            this.updateStickDisplay();
        }
    }
    
    updateStickDisplay() {
        const gp = navigator.getGamepads()[0];
        if (gp) {
            const leftX = Math.round(gp.axes[0] * 100);
            const leftY = Math.round(gp.axes[1] * 100);
            const rightX = Math.round(gp.axes[2] * 100);
            const rightY = Math.round(gp.axes[3] * 100);
            
            this.addOutput(`STICKS → L: (${leftX}, ${leftY}) | R: (${rightX}, ${rightY})`);
        }
    }
    
    setupMouseControls() {
        Object.entries(this.elements).forEach(([key, element]) => {
            if (!element || key.includes('Stick') || key === 'outputDisplay') return;
            
            element.addEventListener('mousedown', () => {
                element.classList.add('pressed');
            });
            
            element.addEventListener('mouseup', () => {
                element.classList.remove('pressed');
            });
            
            element.addEventListener('mouseleave', () => {
                element.classList.remove('pressed');
            });
        });
    }
    
    setupKeyboardControls() {
        const keyMap = {
            'w': 'dpadUp',
            's': 'dpadDown',
            'a': 'dpadLeft',
            'd': 'dpadRight',
            'y': 'y',
            'x': 'x',
            'b': 'b',
            ' ': 'a',
            'q': 'lb',
            'e': 'rb',
            't': 'lt',
            'g': 'rt',
            'v': 'view',
            'm': 'menu',
            'z': 'xbox',
        };
        
        const activeKeys = new Set();
        
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (keyMap[key] && !activeKeys.has(key)) {
                activeKeys.add(key);
                const btn = this.elements[keyMap[key]];
                if (btn) btn.classList.add('pressed');
            }
        });
        
        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (keyMap[key]) {
                activeKeys.delete(key);
                const btn = this.elements[keyMap[key]];
                if (btn) btn.classList.remove('pressed');
            }
        });
    }
    
    setupSkinSelector() {
        const skinSelector = document.getElementById('skinSelector');
        if (skinSelector) {
            skinSelector.addEventListener('change', (e) => {
                this.setSkin(e.target.value);
            });
        }
    }
    
    setSkin(skinName) {
        this.skin = skinName;
        const body = document.body;
        body.className = '';
        body.classList.add(`skin-${skinName}`);
        this.addOutput(`Skin changed to: ${skinName}`);
    }
    
    addOutput(message) {
        this.outputLog.unshift(message);
        if (this.outputLog.length > this.maxLogLines) {
            this.outputLog.pop();
        }
        this.updateDisplay();
    }
    
    updateDisplay() {
        const placeholder = this.elements.outputDisplay.querySelector('.placeholder');
        if (placeholder) placeholder.remove();
        
        this.elements.outputDisplay.innerHTML = this.outputLog
            .map(line => `<div class="output-line">${line}</div>`)
            .join('');
    }
    
    getTime() {
        const now = new Date();
        return now.toLocaleTimeString();
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new XboxControllerUI();
});
