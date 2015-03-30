function Entity(args) {
    args = args || {};

    this.name = args['name'] || "";

    this.transform = new Transform(this, args);

    this.mesh = args['mesh'] || null;
    this.material = args['material'] || null;

    this.controller = args['controller'] || null;

    this.components = args['components'] || [];

    if (this.mesh && !this.getComponent(MeshRenderer)) {
        this.components.push(new MeshRenderer());
    }

    for (var i = 0; i < this.components.length; i++) {
        this.components[i].entity = this;
    }
};

Entity.prototype.update = function(time) {
    if (this.controller) {
        this.controller.update(this);
    }

    for (var i = 0; i < this.components.length; i++) {
        this.components[i].update(time);
    }

    for (var i = 0; i < this.transform.children.length; i++) {
        this.transform.children[i].entity.update(time);
    }
};

Entity.prototype.cleanup = function() {
    this.transform.setParent(null);

    // we can't free any resources or anything since those might be being used by other entities

    for (var i = 0; i < this.transform.children.length; i++) {
        this.transform.children[i].entity.cleanup();
    }
};

Entity.prototype.addComponent = function(component) {
    this.components.push(component);

    component.entity = this;

    return component;
};

Entity.prototype.getComponent = function(type) {
    for (var i = 0; i < this.components.length; i++) {
        if (this.components[i] instanceof type) {
            return this.components[i];
        }
    }

    return null;
};

Entity.prototype.getComponents = function(type) {
    return this.components;
};

Entity.prototype.getComponentsInChildren = function(type) {
    var component = this.getComponent(type);

    var componentsInChildren = [];
    for (var i = 0; i < this.transform.children.length; i++) {
        componentsInChildren = componentsInChildren.concat(this.transform.children[i].entity.getComponentsInChildren(type));
    }

    if (component) {
        return [component].concat(componentsInChildren);
    } else {
        return componentsInChildren;
    }
};

Entity.prototype.forEachComponent = function(type, func) {
    var component = this.getComponent(type);

    if (component) {
        func(component);
    }

    for (var i = 0; i < this.transform.children.length; i++) {
        this.transform.children[i].entity.forEachComponent(type, func);
    }
};

Entity.prototype.destroy = function() {
    this.cleanup();
};
