var Raycast = { };

Raycast.againstBox = function(left, right, bottom, top, back, front, point, direction, result) {
    var t = Infinity;

    var hit = vec3.create();
    var normal = vec3.create();
    
    // bottom
    {
        var tprime = (bottom - point[1]) / direction[1];

        var x = point[0] + tprime * direction[0];
        var z = point[2] + tprime * direction[2];

        if (x >= left && x <= right && z >= back && z <= front && tprime >= 0 && tprime < t) {
            vec3.set(hit, x, bottom, z);
            vec3.set(normal, 0, -1, 0);
            t = tprime;
        }
    }

    // top
    {
        var tprime = (top - point[1]) / direction[1];

        var x = point[0] + tprime * direction[0];
        var z = point[2] + tprime * direction[2];

        if (x >= left && x <= right && z >= back && z <= front && tprime >= 0 && tprime < t) {
            vec3.set(hit, x, top, z);
            vec3.set(normal, 0, 1, 0);
            t = tprime;
        }
    }

    // left
    {
        var tprime = (left - point[0]) / direction[0];

        var y = point[1] + tprime * direction[1];
        var z = point[2] + tprime * direction[2];

        if (y >= bottom && y <= top && z >= back && z <= front && tprime >= 0 && tprime < t) {
            vec3.set(hit, left, y, z);
            vec3.set(normal, -1, 0, 0);
            t = tprime;
        }
    }

    // right
    {
        var tprime = (right - point[0]) / direction[0];

        var y = point[1] + tprime * direction[1];
        var z = point[2] + tprime * direction[2];

        if (y >= bottom && y <= top && z >= back && z <= front && tprime >= 0 && tprime < t) {
            vec3.set(hit, right, y, z);
            vec3.set(normal, 1, 0, 0);
            t = tprime;
        }
    }

    // back
    {
        var tprime = (back - point[2]) / direction[2];

        var x = point[0] + tprime * direction[0];
        var y = point[1] + tprime * direction[1];

        if (x >= left && x <= right && y >= bottom && y <= top && tprime >= 0 && tprime < t) {
            vec3.set(hit, x, y, back);
            vec3.set(normal, 0, 0, -1);
            t = tprime;
        }
    }

    // front
    {
        var tprime = (front - point[2]) / direction[2];

        var x = point[0] + tprime * direction[0];
        var y = point[1] + tprime * direction[1];

        if (x >= left && x <= right && y >= bottom && y <= top && tprime >= 0 && tprime < t) {
            vec3.set(hit, x, y, front);
            vec3.set(normal, 0, 0, 1);
            t = tprime;
        }
    }

    if (t != Infinity) {
        vec3.copy(result.point, point);
        vec3.copy(result.normal, normal);

        return true;
    } else {
        return false;
    }
};

function RaycastHit() {
    this.point = vec3.create();
    this.normal = vec3.create();

    this.collider = null;
};

RaycastHit.prototype.setTo = function(hit) {
    vec3.copy(this.point, hit.point);
    vec3.copy(this.normal, hit.normal);

    this.collider = hit.collider;
};

RaycastHit.prototype.transform = function(transform, inverse) {
    // transforming the point is as expected
    vec3.transformMat4(this.point, this.point, transform);

    // transforming the normal involves using the transpose of transform
    var normal = vec4.fromValues(this.normal[0], this.normal[1], this.normal[2], 0);
    vec4.transformMat4(normal, normal, inverse);
    vec3.set(this.normal, normal[0], normal[1], normal[2]);
    vec3.normalize(this.normal, this.normal);
}
