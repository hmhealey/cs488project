function Interactable(args) {
    Component.call(this, args);
};

Interactable.prototype = Object.create(Component.prototype);
Interactable.prototype.constructor = Interactable;

Interactable.prototype.interact = function() { };
