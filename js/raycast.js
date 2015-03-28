var Raycast = { };

Raycast.againstXYPlane = function(x1, x2, y1, y2, z, point, direction, hit) {
    var t = (z - point[2]) / direction[2];

    var x = point[0] + t * direction[0];
    var y = point[1] + t * direction[1];

    if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
        return t;
    } else {
        return Infinity;
    }
};

Raycast.againstXZPlane = function(x1, x2, y, z1, z2, point, direction) {
    var t = (y - point[1]) / direction[1];

    var x = point[0] + t * direction[0];
    var z = point[2] + t * direction[2];

    if (x >= x1 && x <= x2 && z >= z1 && z <= z2) {
        return true;
    } else {
        return false;
    }
};

Raycast.againstYZPlane = function(x, y1, y2, z1, z2, point, direction, hitPoint, hitNormal) {
    var t = (x - point[0]) / direction[0];

    var y = point[1] + t * direction[1];
    var z = point[2] + t * direction[2];

    if (y >= y1 && y <= y2 && z >= z1 && z <= z2) {
        vec3.set(hit.point, x, y, z);

        return true;
    } else {
        return false;
    }
};

Raycast.againstBox = function(left, right, bottom, top, front, back, point, direction, result) {
    var t = Infinity;

    var hit = vec3.create();
    var normal = vec3.create();
    
    // top
    {
        var tprime = (top - point[2]) / direction[2];

        var x = point[0] + tprime * direction[0];
        var y = point[1] + tprime * direction[1];

        if (x >= left && x <= right && y >= bottom && y <= top && tprime >= 0 && tprime < t) {
            console.log('hit top!');
            vec3.set(hit, x, y, top);
            vec3.set(normal, 0, 1, 0);
            t = tprime;
        }
    }

    // bottom
    {
        var tprime = (bottom - point[2]) / direction[2];

        var x = point[0] + tprime * direction[0];
        var y = point[1] + tprime * direction[1];

        if (x >= left && x <= right && y >= bottom && y <= top && tprime >= 0 && tprime < t) {
            console.log('hit bottom!');
            vec3.set(hit, x, y, bottom);
            vec3.set(normal, 0, -1, 0);
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
