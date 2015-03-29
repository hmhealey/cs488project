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

function CylinderCollider(args) {
    args = args || {};

    // call super constructor
    Collider.call(this, args);

    this.radius = args['radius'] || 1;
    this.height = args['height'] || 1;
};

CylinderCollider.prototype = Object.create(Collider.prototype);
CylinderCollider.prototype.constructor = BoxCollider;

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
