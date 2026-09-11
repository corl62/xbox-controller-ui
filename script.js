// Xbox Controller UI - Interactive Script

// Get all button elements
const buttons = {
    // D-Pad
    dpadUp: document.querySelector('[data-button="dpad-up"]'),
    dpadDown: document.querySelector('[data-button="dpad-down"]'),
    dpadLeft: document.querySelector('[data-button="dpad-left"]'),
    dpadRight: document.querySelector('[data-button="dpad-right"]'),
    
    // Action Buttons
    y: document.querySelector('[data-button="y"]'),
    x: document.querySelector('[data-button="x"]'),
    b: document.querySelector('[data-button="b"]'),
    a: document.querySelector('[data-button="a"]'),
    
    // Bumpers
    lb: document.querySelector('[data-button="lb"]'),
    rb: document.querySelector('[data-button="rb"]'),
    
    // Triggers
    lt: document.querySelector('[data-button="lt"]'),
    rt: document.querySelector('[data-button="rt"]'),
    
    // Menu Buttons
    menu: document.querySelector('[data-button="menu"]'),
    view: document.querySelector('[data-button="view"]'),
    xbox: document.querySelector('[data-button="xbox"]'),
    
    // Sticks
    leftStick: document.getElementById('leftStick'),
    rightStick: document.getElementById('rightStick'),
    leftStickClick: document.querySelector('[data-button="left-stick-click"]'),
    rightStickClick: document.querySelector('[data-button="right-stick-click"]'),
    
    // Output Display
    outputDisplay: document.getElementById('outputDisplay'),
};

// Stick tracking
let stickState = {
    left: { active: false, x: 0, y: 0 },
    right: { active: false, x: 0, y: 0 }
};

// Output log
let outputLog = [];
const MAX_LOG_LINES = 10;

// Add button press listener
function addButtonListener(button, name) {
    if (!button) return;
    
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.95)';
        addOutput(`[${new Date().toLocaleTimeString()}] ${name} PRESSED`);
    });
    
    button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1)';
        addOutput(`[${new Date().toLocaleTimeString()}] ${name} RELEASED`);
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
    
    // Touch support
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        button.style.transform = 'scale(0.95)';
        addOutput(`[${new Date().toLocaleTimeString()}] ${name} PRESSED`);
    });
    
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        button.style.transform = 'scale(1)';
        addOutput(`[${new Date().toLocaleTimeString()}] ${name} RELEASED`);
    });
}

// Setup all button listeners
addButtonListener(buttons.dpadUp, 'D-PAD UP');
addButtonListener(buttons.dpadDown, 'D-PAD DOWN');
addButtonListener(buttons.dpadLeft, 'D-PAD LEFT');
addButtonListener(buttons.dpadRight, 'D-PAD RIGHT');
addButtonListener(buttons.y, 'Button Y');
addButtonListener(buttons.x, 'Button X');
addButtonListener(buttons.b, 'Button B');
addButtonListener(buttons.a, 'Button A');
addButtonListener(buttons.lb, 'LB Bumper');
addButtonListener(buttons.rb, 'RB Bumper');
addButtonListener(buttons.lt, 'LT Trigger');
addButtonListener(buttons.rt, 'RT Trigger');
addButtonListener(buttons.menu, 'Menu');
addButtonListener(buttons.view, 'View');
addButtonListener(buttons.xbox, 'Xbox Button');
addButtonListener(buttons.leftStickClick, 'L3 (Left Stick Click)');
addButtonListener(buttons.rightStickClick, 'R3 (Right Stick Click)');

// Stick handling
function setupStick(stickElement, stickName, side) {
    if (!stickElement) return;
    
    const stickInner = stickElement.querySelector('.stick-inner');
    const maxRadius = 40;
    
    function handleStickMove(clientX, clientY) {
        const rect = stickElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const x = clientX - centerX;
        const y = clientY - centerY;
        
        const distance = Math.sqrt(x * x + y * y);
        
        let finalX = x;
        let finalY = y;
        
        if (distance > maxRadius) {
            const angle = Math.atan2(y, x);
            finalX = Math.cos(angle) * maxRadius;
            finalY = Math.sin(angle) * maxRadius;
        }
        
        stickInner.style.transform = `translate(${finalX}px, ${finalY}px)`;
        
        const stickX = Math.round((finalX / maxRadius) * 100);
        const stickY = Math.round((finalY / maxRadius) * 100);
        
        stickState[side].x = stickX;
        stickState[side].y = stickY;
        
        updateStickDisplay();
    }
    
    stickElement.addEventListener('mousedown', (e) => {
        stickState[side].active = true;
        addOutput(`[${new Date().toLocaleTimeString()}] ${stickName} ACTIVE`);
        handleStickMove(e.clientX, e.clientY);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (stickState[side].active) {
            handleStickMove(e.clientX, e.clientY);
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (stickState[side].active) {
            stickState[side].active = false;
            stickState[side].x = 0;
            stickState[side].y = 0;
            stickInner.style.transform = 'translate(0, 0)';
            addOutput(`[${new Date().toLocaleTimeString()}] ${stickName} RELEASED`);
            updateStickDisplay();
        }
    });
    
    // Touch support
    stickElement.addEventListener('touchstart', (e) => {
        stickState[side].active = true;
        const touch = e.touches[0];
        addOutput(`[${new Date().toLocaleTimeString()}] ${stickName} ACTIVE`);
        handleStickMove(touch.clientX, touch.clientY);
    });
    
    document.addEventListener('touchmove', (e) => {
        if (stickState[side].active) {
            const touch = e.touches[0];
            handleStickMove(touch.clientX, touch.clientY);
        }
    });
    
    document.addEventListener('touchend', () => {
        if (stickState[side].active) {
            stickState[side].active = false;
            stickState[side].x = 0;
            stickState[side].y = 0;
            stickInner.style.transform = 'translate(0, 0)';
            addOutput(`[${new Date().toLocaleTimeString()}] ${stickName} RELEASED`);
            updateStickDisplay();
        }
    });
}

setupStick(buttons.leftStick, 'Left Stick', 'left');
setupStick(buttons.rightStick, 'Right Stick', 'right');

// Output management
function addOutput(message) {
    outputLog.unshift(message);
    if (outputLog.length > MAX_LOG_LINES) {
        outputLog.pop();
    }
    updateDisplayOutput();
}

function updateDisplayOutput() {
    const placeholder = buttons.outputDisplay.querySelector('.placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    
    buttons.outputDisplay.innerHTML = outputLog.map(line => `<div>${line}</div>`).join('');
}

function updateStickDisplay() {
    const leftStickInfo = `LEFT: (${stickState.left.x}, ${stickState.left.y})`;
    const rightStickInfo = `RIGHT: (${stickState.right.x}, ${stickState.right.y})`;
    addOutput(`STICK POSITION: ${leftStickInfo} | ${rightStickInfo}`);
}

// Keyboard support
const keyMap = {
    'w': { element: 'dpadUp', name: 'D-PAD UP' },
    's': { element: 'dpadDown', name: 'D-PAD DOWN' },
    'a': { element: 'dpadLeft', name: 'D-PAD LEFT' },
    'd': { element: 'dpadRight', name: 'D-PAD RIGHT' },
    'y': { element: 'y', name: 'Button Y' },
    'x': { element: 'x', name: 'Button X' },
    'b': { element: 'b', name: 'Button B' },
    ' ': { element: 'a', name: 'Button A' },
    'q': { element: 'lb', name: 'LB Bumper' },
    'e': { element: 'rb', name: 'RB Bumper' },
    't': { element: 'lt', name: 'LT Trigger' },
    'g': { element: 'rt', name: 'RT Trigger' },
    'v': { element: 'view', name: 'View' },
    'm': { element: 'menu', name: 'Menu' },
    'z': { element: 'xbox', name: 'Xbox Button' },
};

const activeKeys = new Set();

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keyMap[key] && !activeKeys.has(key)) {
        activeKeys.add(key);
        const btn = buttons[keyMap[key].element];
        if (btn) {
            btn.dispatchEvent(new MouseEvent('mousedown'));
        }
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keyMap[key]) {
        activeKeys.delete(key);
        const btn = buttons[keyMap[key].element];
        if (btn) {
            btn.dispatchEvent(new MouseEvent('mouseup'));
        }
    }
});

// Initialize
addOutput('Xbox Controller Ready!');
addOutput('Click buttons, drag sticks, or use keyboard shortcuts...');
