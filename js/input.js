var Input = {
    LEFT_MOUSE: 0,
    MIDDLE_MOUSE: 1,
    RIGHT_MOUSE: 2,
    keys: {
        87: false, // w
        65: false, // a
        83: false, // s
        68: false, // d
        73: false, // i
        74: false, // j
        75: false, // k
        76: false, // l       
        38: false, // up arrow
        37: false, // left arrow
        40: false, // down arrow
        39: false, // right arrow
        32: false, // space
        16: false, // shift
        17: false, // ctrl
        18: false, // alt
        91: false, // command key (and windows key?)
        27: false, // escape
    },
    previousKeys: {}, // initialized in Input.initialize()
    Mouse: {
        buttons: {},
        previousButtons: {},

        // the change in position of the mouse over this tick and over the next tick
        deltaX: 0,
        deltaY: 0,
        nextDeltaX: 0,
        nextDeltaY: 0
    }
};

Input.initialize = function() {
    Input.previousKeys = deepCopy(Input.keys);
};

Input.updateMousePosition = function() {
    Input.Mouse.deltaX = Input.Mouse.nextDeltaX;
    Input.Mouse.deltaY = Input.Mouse.nextDeltaY;
    Input.Mouse.nextDeltaX = 0;
    Input.Mouse.nextDeltaY = 0;
}

Input.updateKeys = function() {
    for (var key in Input.keys) {
        Input.previousKeys[key] = Input.keys[key];
    }

    for (var button in Input.Mouse.buttons) {
        Input.Mouse.previousButtons[button] = Input.Mouse.buttons[button];
    }
};

Input.onKeyDown = function(event) {
    var key = event.keyCode;
    if (key in Input.keys) {
        Input.keys[key] = true;
    }
};

Input.onKeyUp = function(event) {
    var key = event.keyCode;
    if (key in Input.keys) {
        Input.keys[key] = false;
    }
};

Input.getKey = function(keyCode) {
    return Input.keys[keyCode] || false;
};

Input.getKeyDown = function(keyCode) {
    return Input.keys[keyCode] && !Input.previousKeys[keyCode] || false;
};

Input.getKeyUp = function(keyCode) {
    return !Input.keys[keyCode] && Input.previousKeys[keyCode] || false;
};

Input.onMouseDown = function(event) {
    Input.Mouse.buttons[event.button] = true;
};

Input.onMouseMove = function(event) {
    Input.Mouse.nextDeltaX += event.movementX;
    Input.Mouse.nextDeltaY += event.movementY;
};

Input.onMouseUp = function(event) {
    if (!Input.Mouse.isLocked()) {
        canvas.requestPointerLock();
    }

    Input.Mouse.buttons[event.button] = false;
};

Input.Mouse.isLocked = function() {
    return document.pointerLockElement === canvas ||
           document.mozPointerLockElement === canvas ||
           document.webkitPointerLockElement === canvas;
};

Input.Mouse.getButton = function(button) {
    return Input.Mouse.buttons[button] || false;
};

Input.Mouse.getButtonDown = function(button) {
    return (Input.Mouse.buttons[button] && !Input.Mouse.previousButtons[button]) || false;
};

Input.Mouse.getButtonUp = function(button) {
    return !Input.Mouse.buttons[button] && Input.Mouse.previousButtons[button] || false;
};
