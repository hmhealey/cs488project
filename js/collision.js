function BoxCollider(args) {
    args = args || {};

    this.entity = args['entity'] || null;

    this.width = args['width'] || 1;
    this.height = args['height'] || 1;
    this.depth = args['depth'] || 1;
};

BoxCollider.draw = true;
BoxCollider.drawLineWidth = 2.0;

BoxCollider.prototype.draw = function() {
    if (BoxCollider.draw) {
        var shader = Shader.getShader("wireframe");

        if (shader && shader.linked) {
            gl.disable(gl.DEPTH_TEST);

            shader.bind();
            shader.updateMatrices(level.mainCamera, this.entity.transform.getLocalToWorldMatrix());

            shader.setUniformVector4("colour", vec4.fromValues(0.5, 0.0, 1.0, 1.0));

            // this is a debug operation, so we're fine to constantly create new meshes
            var mesh = Mesh.makeWireframeBox(this.width, this.height, this.depth);

            gl.lineWidth(BoxCollider.drawLineWidth);
            mesh.draw(shader);

            mesh.cleanup();

            shader.release();

            gl.enable(gl.DEPTH_TEST);
        }
    }
};

BoxCollider.prototype.update = function(time) { };

BoxCollider.prototype.raycast = function(point, direction, hit) {
    var localPoint = vec3.create();
    vec3.transformMat4(localPoint, point, this.entity.transform.getWorldToLocalMatrix());
    var localDirection = vec3.create();
    vec3.transformMat4AsVector(localDirection, direction, this.entity.transform.getWorldToLocalMatrix());

    var intersected = Raycast.againstBox(-this.width / 2, this.width / 2, -this.height / 2, this.height / 2,
                                         -this.depth / 2, this.depth / 2, localPoint, localDirection, hit);

    if (intersected) {
        hit.collider = this;
        hit.transform(this.entity.transform.getLocalToWorldMatrix(),
                      this.entity.transform.getWorldToLocalMatrix());
    }

    return intersected;

    /*var childHit = new RaycastHit();
    var childIntersected = this.raycastChildren(point, direction, childHit);

    if (intersected || childIntersected) {
        if (intersected && childIntersected) {
            if (vec3.distance(point, childHit.point) < vec3.distance(point, hit.point)) {
                hit.setTo(childHit);
            }
        } else if (childIntersected) {
            hit.setTo(childHit);
        }

        return true;
    } else {
        // the ray missed us and our children
        return false;
    }*/
};

BoxCollider.prototype.raycastChildren = function(point, direction, hit) {
    // TODO remove me
    var intersected = false;

    var childHit = new RaycastHit();

    var children = this.entity.getComponentsInChildren(BoxCollider);
    for (var i = 0; i < children.length; i++) {
        var child = children[i];

        if (!this.children[i].raycast(point, direction, childHit)) {
            if (!intersected || vec3.distance(point, childHit.point) < vec3.distance(point, hit.point)) {
                hit.setTo(childHit);
                intersected = true;
            }
        }
    }

    return intersected;
};

BoxCollider.prototype.contains = function(point) {
    return point[0] >= -this.width / 2 && point[0] < this.width / 2 &&
           point[1] >= -this.height / 2 && point[1] < this.height / 2 &&
           point[2] >= -this.depth / 2 && point[2] < this.depth / 2;
};

BoxCollider.prototype.containsWorld = function(point) {
    var localPoint = vec3.transformMat4(vec3.create(), point, this.entity.transform.getWorldToLocalMatrix());
    return this.contains(localPoint);
};
