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
