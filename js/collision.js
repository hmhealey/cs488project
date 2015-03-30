function Collider(args) {
    args = args || {};

    this.entity = args['entity'] || null;
};

Collider.draw = true;
Collider.drawLineWidth = 2.0;

Collider.prototype.draw = function() { };

Collider.prototype.update = function() { };

Collider.prototype.raycastLocal = function(point, direction, hit) {
    return false;
};

Collider.prototype.raycast = function(point, direction, hit, filter) {
    // only bother doing calculations if this object is overriding the default raycastLocal
    if (this.raycastLocal != Collider.prototype.raycastLocal && (!filter || filter(this))) {
        var localPoint = vec3.create();
        vec3.transformMat4(localPoint, point, this.entity.transform.getWorldToLocalMatrix());
        var localDirection = vec3.create();
        vec3.transformMat4AsVector(localDirection, direction, this.entity.transform.getWorldToLocalMatrix());

        var intersected = this.raycastLocal(localPoint, localDirection, hit);

        if (intersected) {
            hit.collider = this;
            hit.transform(this.entity.transform.getLocalToWorldMatrix(),
                          this.entity.transform.getWorldToLocalMatrix());
        }

        return intersected;
    } else {
        return false;
    }
};

Collider.prototype.containsLocal = function(localPoint) {
    return false;
};

Collider.prototype.contains = function(point) {
    var localPoint = vec3.transformMat4(vec3.create(), point, this.entity.transform.getWorldToLocalMatrix());
    return this.contains(localPoint);
};

function BoxCollider(args) {
    args = args || {};

    // call super constructor
    Collider.call(this, args);

    this.width = args['width'] || 1;
    this.height = args['height'] || 1;
    this.depth = args['depth'] || 1;
};

BoxCollider.prototype = Object.create(Collider.prototype);
BoxCollider.prototype.constructor = BoxCollider;

BoxCollider.prototype.draw = function() {
    if (Collider.draw) {
        var shader = Shader.getShader("wireframe");

        if (shader && shader.linked) {
            gl.disable(gl.DEPTH_TEST);

            shader.bind();
            shader.updateMatrices(level.mainCamera, this.entity.transform.getLocalToWorldMatrix());

            shader.setUniformVector4("colour", vec4.fromValues(0.5, 0.0, 1.0, 1.0));

            // this is a debug operation, so we're fine to constantly create new meshes
            var mesh = Mesh.makeWireframeBox(this.width, this.height, this.depth);

            gl.lineWidth(Collider.drawLineWidth);
            mesh.draw(shader);

            mesh.cleanup();

            shader.release();

            gl.enable(gl.DEPTH_TEST);
        }
    }
};

BoxCollider.prototype.raycastLocal = function(point, direction, hit) {
    var intersected = Raycast.againstBox(-this.width / 2, this.width / 2, -this.height / 2, this.height / 2,
                                         -this.depth / 2, this.depth / 2, point, direction, hit);

    if (intersected) {
        hit.collider = this;
    }

    return intersected;
};

BoxCollider.prototype.containsLocal = function(point) {
    return point[0] >= -this.width / 2 && point[0] < this.width / 2 &&
           point[1] >= -this.height / 2 && point[1] < this.height / 2 &&
           point[2] >= -this.depth / 2 && point[2] < this.depth / 2;
};

BoxCollider.prototype.collidesWith = function(other, delta) {
    // assumes that boxes are axis-aligned and unscaled
    var dx = delta[0] || 0;
    var dy = delta[1] || 0;
    var dz = delta[2] || 0;

    var worldPosition = this.entity.transform.getWorldPosition();
    var otherWorldPosition = other.entity.transform.getWorldPosition();

    if (other instanceof BoxCollider) {
        var left = worldPosition[0] + dx - this.width / 2;
        var right = worldPosition[0] + dx + this.width / 2;
        var bottom = worldPosition[0] + dy - this.height / 2;
        var top = worldPosition[1] + dy + this.height / 2;
        var back = worldPosition[2] + dz - this.depth / 2;
        var front = worldPosition[2] + dz + this.depth / 2;

        var otherLeft = otherWorldPosition[0] - other.width / 2;
        var otherRight = otherWorldPosition[0] + other.width / 2;
        var otherBottom = otherWorldPosition[0] - other.height / 2;
        var otherTop = otherWorldPosition[1] + other.height / 2;
        var otherBack = otherWorldPosition[2] - other.depth / 2;
        var otherFront = otherWorldPosition[2] + other.depth / 2;

        return right >= otherLeft && left <= otherRight && top >= otherBottom && bottom <= otherTop && front >= otherBack && back <= otherFront;
    } else {
        console.log(this.entity.name + " is unable to collide with " + other.entity.name + " because its Collider is not a BoxCollider");
        return false;
    }
};

function CylinderCollider(args) {
    args = args || {};

    // call super constructor
    Collider.call(this, args);

    this.center = vec3.create(); // not actually used other than to make me feel better during hard calculations
    this.radius = args['radius'] || 1;
    this.height = args['height'] || 1;
};

CylinderCollider.prototype = Object.create(Collider.prototype);
CylinderCollider.prototype.constructor = CylinderCollider;

CylinderCollider.prototype.raycastLocal = function(point, direction, hit) {
    var intersected = Raycast.againstCylinder(this.radius, this.height, point, direction, hit);

    if (intersected) {
        hit.collider = this;
    }

    return intersected;
};

CylinderCollider.prototype.containsLocal = function(point) {
    return point[1] <= -this.height / 2 && point[1] < this.height / 2 &&
           point[0] * point[0] + point[2] * point[2] <= radius * radius;
};

CylinderCollider.prototype.collidesWith = function(other, delta) {
    console.log("Collision is not supported for CylinderColliders.");
    return false;
};

function SphereCollider(args) {
    args = args || {};

    // call super constructor
    Collider.call(this, args);

    this.center = args['center'] || vec3.create();
    this.radius = args['radius'] || 1;
};

SphereCollider.prototype = Object.create(Collider.prototype);
SphereCollider.prototype.constructor = SphereCollider;

SphereCollider.prototype.raycastLocal = function(point, direction, hit) {
    var intersected = Raycast.againstSphere(this.center, this.radius, point, direction, hit);

    if (intersected) {
        hit.collider = this;
    }

    return intersected;
};

SphereCollider.prototype.containsLocal = function(localPoint) {
    var dx = localPoint[0] - this.center[0];
    var dy = localPoint[1] - this.center[1];
    var dz = localPoint[2] - this.center[2];

    return dx * dx + dy * dy + dz * dz <= this.radius * this.radius;
};

SphereCollider.prototype.collidesWith = function(other, delta) {
    console.log("Collision is not supported for SphereColliders.");
    return false;
};
