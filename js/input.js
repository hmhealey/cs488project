var Input = {
    keys: {
        87: false, // w
        65: false, // a
        83: false, // s
        68: false, // d
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
    Cursor: {
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

Input.update = function() {
    for (var key in Input.keys) {
        Input.previousKeys[key] = Input.keys[key];
    }

    Input.Cursor.deltaX = Input.Cursor.nextDeltaX;
    Input.Cursor.deltaY = Input.Cursor.nextDeltaY;
    Input.Cursor.nextDeltaX = 0;
    Input.Cursor.nextDeltaY = 0;
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

Input.isKeyDown = function(keyCode) {
    return Input.keys[keyCode] || false;
};

Input.wasKeyDown = function(keyCode) {
    return Input.previousKeys[keyCode] || false;
};

Input.onMouseDown = function(event) {
};

Input.onMouseMove = function(event) {
    Input.Cursor.nextDeltaX += event.movementX;
    Input.Cursor.nextDeltaY += event.movementY;
};

Input.onMouseUp = function(event) {
    if (!Input.Cursor.isLocked()) {
        canvas.requestPointerLock();
    }
};

Input.Cursor.isLocked = function() {
    return document.pointerLockElement === canvas ||
           document.mozPointerLockElement === canvas ||
           document.webkitPointerLockElement === canvas;
};
