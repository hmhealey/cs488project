var Input = {
    keys: {
        87: false, // w
        65: false, // a
        83: false, // s
        68: false, // d
        32: false, // space
        16: false, // shift
        17: false, // ctrl
        18: false, // alt
        91: false, // command key (and windows key?)
        27: false, // escape
    },
    previousKeys: {} // initialized in Input.initialize()
};

Input.initialize = function() {
    Input.previousKeys = deepCopy(Input.keys);
};

Input.update = function() {
    for (var key in Input.keys) {
        Input.previousKeys[key] = Input.keys[key];
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
