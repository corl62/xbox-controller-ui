// Button Elements
const buttons = {
    lb: document.getElementById('lb'),
    rb: document.getElementById('rb'),
    lt: document.getElementById('lt'),
    rt: document.getElementById('rt'),
    dpadUp: document.getElementById('dpad-up'),
    dpadDown: document.getElementById('dpad-down'),
    dpadLeft: document.getElementById('dpad-left'),
    dpadRight: document.getElementById('dpad-right'),
    btnY: document.getElementById('btn-y'),
    btnX: document.getElementById('btn-x'),
    btnB: document.getElementById('btn-b'),
    btnA: document.getElementById('btn-a'),
    leftStick: document.getElementById('left-stick'),
    leftStickBtn: document.getElementById('left-stick-btn'),
    rightStick: document.getElementById('right-stick'),
    rightStickBtn: document.getElementById('right-stick-btn'),
    viewBtn: document.getElementById('view-btn'),
    menuBtn: document.getElementById('menu-btn'),
    xboxBtn: document.getElementById('xbox-btn'),
    outputDisplay: document.getElementById('output-display'),
};

// Track stick positions
let leftStickActive = false;
let rightStickActive = false;
let leftStickX = 0;
let leftStickY = 0;
let rightStickX = 0;
let rightStickY = 0;

// Add click handlers to regular buttons
function addButtonListener(element, buttonName) {
    if (!element) return;
    
    element.addEventListener('mousedown', () => {
        element.classList.add('active');
        displayOutput(`${buttonName} PRESSED`);
    });
    
    element.addEventListener('mouseup', () => {
        element.classList.remove('active');
        displayOutput(`${buttonName} RELEASED`);
    });
    
    element.addEventListener('mouseleave', () => {
        element.classList.remove('active');
    });
    
    // Touch support
    element.addEventListener('touchstart', (e) => {
        e.preventDefault();
        element.classList.add('active');
        displayOutput(`${buttonName} PRESSED`);
    });
    
    element.addEventListener('touchend', (e) => {
        e.preventDefault();
        element.classList.remove('active');
        displayOutput(`${buttonName} RELEASED`);
    });
}

// Add listeners for all buttons
addButtonListener(buttons.lb, 'LB');
addButtonListener(buttons.rb, 'RB');
addButtonListener(buttons.lt, 'LT');
addButtonListener(buttons.rt, 'RT');
addButtonListener(buttons.dpadUp, 'D-PAD UP');
addButtonListener(buttons.dpadDown, 'D-PAD DOWN');
addButtonListener(buttons.dpadLeft, 'D-PAD LEFT');
addButtonListener(buttons.dpadRight, 'D-PAD RIGHT');
addButtonListener(buttons.btnY, 'Y');
addButtonListener(buttons.btnX, 'X');
addButtonListener(buttons.btnB, 'B');
addButtonListener(buttons.btnA, 'A');
addButtonListener(buttons.leftStickBtn, 'L3');
addButtonListener(buttons.rightStickBtn, 'R3');
addButtonListener(buttons.viewBtn, 'VIEW');
addButtonListener(buttons.menuBtn, 'MENU');
addButtonListener(buttons.xboxBtn, 'XBOX');

// Stick handling
function handleStick(stickElement, stickInner, isLeft) {
    const stickContainer = stickElement.parentElement;
    const containerRect = stickContainer.getBoundingClientRect();
    const containerCenterX = containerRect.width / 2;
    const containerCenterY = containerRect.height / 2;
    const maxDistance = 45;

    function updateStickPosition(clientX, clientY) {
        const rect = stickContainer.getBoundingClientRect();
        const x = clientX - rect.left - containerCenterX;
        const y = clientY - rect.top - containerCenterY;
        
        const distance = Math.sqrt(x * x + y * y);
        
        if (distance <= maxDistance) {
            stickInner.style.transform = `translate(${x}px, ${y}px)`;
            if (isLeft) {
                leftStickX = Math.round((x / maxDistance) * 100);
                leftStickY = Math.round((y / maxDistance) * 100);
            } else {
                rightStickX = Math.round((x / maxDistance) * 100);
                rightStickY = Math.round((y / maxDistance) * 100);
            }
            updateStickDisplay();
        } else {
            const angle = Math.atan2(y, x);
            const limitedX = Math.cos(angle) * maxDistance;
            const limitedY = Math.sin(angle) * maxDistance;
            stickInner.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
            if (isLeft) {
                leftStickX = Math.round((limitedX / maxDistance) * 100);
                leftStickY = Math.round((limitedY / maxDistance) * 100);
            } else {
                rightStickX = Math.round((limitedX / maxDistance) * 100);
                rightStickY = Math.round((limitedY / maxDistance) * 100);
            }
            updateStickDisplay();
        }
    }

    function resetStick() {
        stickInner.style.transform = 'translate(0, 0)';
        if (isLeft) {
            leftStickX = 0;
            leftStickY = 0;
            leftStickActive = false;
        } else {
            rightStickX = 0;
            rightStickY = 0;
            rightStickActive = false;
        }
        updateStickDisplay();
    }

    stickElement.addEventListener('mousedown', () => {
        if (isLeft) {
            leftStickActive = true;
        } else {
            rightStickActive = true;
        }
        displayOutput(`${isLeft ? 'LEFT' : 'RIGHT'} STICK ACTIVE`);
    });

    stickElement.addEventListener('mousemove', (e) => {
        if (isLeft ? leftStickActive : rightStickActive) {
            updateStickPosition(e.clientX, e.clientY);
        }
    });

    stickElement.addEventListener('mouseup', resetStick);
    stickElement.addEventListener('mouseleave', resetStick);

    // Touch support
    stickElement.addEventListener('touchstart', () => {
        if (isLeft) {
            leftStickActive = true;
        } else {
            rightStickActive = true;
        }
        displayOutput(`${isLeft ? 'LEFT' : 'RIGHT'} STICK ACTIVE`);
    });

    stickElement.addEventListener('touchmove', (e) => {
        if (isLeft ? leftStickActive : rightStickActive) {
            e.preventDefault();
            const touch = e.touches[0];
            updateStickPosition(touch.clientX, touch.clientY);
        }
    });

    stickElement.addEventListener('touchend', resetStick);
}

handleStick(buttons.leftStick, buttons.leftStick.querySelector('.stick-inner'), true);
handleStick(buttons.rightStick, buttons.rightStick.querySelector('.stick-inner'), false);

// Display output
let outputTimeout;
function displayOutput(message) {
    buttons.outputDisplay.textContent = message;
    
    clearTimeout(outputTimeout);
    outputTimeout = setTimeout(() => {
        buttons.outputDisplay.textContent = 'Press buttons to see activity...';
    }, 2000);
}

function updateStickDisplay() {
    const message = `LEFT STICK: (${leftStickX}, ${leftStickY}) | RIGHT STICK: (${rightStickX}, ${rightStickY})`;
    buttons.outputDisplay.textContent = message;
}

// Keyboard support
const keyMap = {
    'w': 'dpadUp',
    's': 'dpadDown',
    'a': 'dpadLeft',
    'd': 'dpadRight',
    'y': 'btnY',
    'x': 'btnX',
    'b': 'btnB',
    ' ': 'btnA',
    'q': 'lb',
    'e': 'rb',
    't': 'lt',
    'g': 'rt',
    'v': 'viewBtn',
    'm': 'menuBtn',
    'z': 'xboxBtn',
};

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keyMap[key]) {
        const element = buttons[keyMap[key]];
        if (element && !element.classList.contains('active')) {
            element.classList.add('active');
            element.dispatchEvent(new MouseEvent('mousedown'));
        }
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keyMap[key]) {
        const element = buttons[keyMap[key]];
        if (element) {
            element.classList.remove('active');
            element.dispatchEvent(new MouseEvent('mouseup'));
        }
    }
});

// Initialize
displayOutput('Ready! Click buttons or use keyboard...');
