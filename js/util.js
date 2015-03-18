/** Adds an event handler to a DOM event in a cross-browser manner. **/
var attachEvent = function(element, eventName, handler) {
    if (element) {
        if (element.addEventListener) {
            element.addEventListener(eventName, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + eventName, handler);
        } else {
            // this overrides any existing events so it's our last fallback
            element["on" + eventName] = handler;
        }
    }
};

/** Requests a text file as a string and calls callback with its contents as a string once it has been received. 
 *  If an error occurs, errorCallback is called with the url and the http status code. Either of these callbacks
 *  can be undefined. **/
var requestFile = function(url, callback, errorCallback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onreadystatechange = function() {
        // if the request is DONE
        if (request.readyState == 4) {
            if (request.status == 200) {
                if (callback) {
                    callback(request.responseText);
                }
            } else {
                if (errorCallback) {
                    errorCallback(url, request.status);
                }
            }
        }
    };

    request.send(null);
};

/** Returns a deep copy of the provided object. **/
var deepCopy = function(obj) {
    // http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
    if (null == obj || "object" != typeof obj) return obj;

    var copy = obj.constructor();

    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            copy[attr] = obj[attr];
        }
    }

    return copy;
};

/** Returns true if the given value is a regular array or a typed array. **/
var isArrayOrTypedArray = function(value) {
    // this apparently doesn't work for Arrays created in other frames, but I don't plan on using frames
    return value && (value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer));
};

/** Returns a vec3 when given a vec3. Returns a vec3 where each element is the argument when given a single value. **/
var toVec3 = function(value) {
    if (isArrayOrTypedArray(value)) {
        return value;
    } else {
        return vec3.fromValues(value, value, value);
    }
};
