function Component(args) {
    args = args || {};

    this.entity = args['entity'] || null;

    this.enabled = 'enabled' in args ? args['enabled'] : true;
};

Component.prototype.update = function() { };

Component.prototype.draw = function() { };
