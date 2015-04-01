function Component(args) {
    args = args || {};

    this.entity = args['entity'] || null;

    this.enabled = 'enabled' in args ? args['enabled'] : true;
};

Component.prototype.update = function() { };

Component.prototype.draw = function() { };

Component.prototype.cleanup = function() { };

Component.prototype.destroy = function() {
    this.cleanup();

    removeFromArray(this.entity.components, this);

    this.entity = null;
};
