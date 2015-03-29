var Raycast = { };

Raycast.againstBox = function(left, right, bottom, top, back, front, point, direction, result) {
    var t = Infinity;

    // TODO we really could just use the ones in result instead of also creating these
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

Raycast.againstCylinder = function(radius, height, point, direction, hit) {
    // cast first against the top-down profile (a circle) to find where we hit the wall of the cylinder
    var a = direction[0] * direction[0] + direction[2] * direction[2];
    var b = 2 * (point[0] * direction[0] + point[2] * direction[2]);
    var c = point[0] * point[0] + point[2] * point[2] - radius * radius;

    // a * t^2 + b * t + c = 0
    var discriminant = b * b - 4 * a * c;

    if (discriminant >= 0) {
        // t1 will always be less than t2 since it's where we're subtracting sqrt(discriminant)
        var t1 = (-b - Math.sqrt(discriminant)) / (2 * a);

        var hitPoint = vec3.scaleAndAdd(vec3.create(), point, direction, t1);

        if (hitPoint[1] >= -height / 2 && hitPoint[1] <= height / 2) {
            // we've hit the wall of the cylinder first
            vec3.copy(hit.point, hitPoint);
            vec3.normalize(hit.normal, hit.point);

            return true;
        } else {
            // we missed the wall of the cylinder, but we may still be hitting the top or bottom
            var t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

            // now we have to find where the line formed by t1, t2 intersects the top or bottom (if it even does)
            var t = t2;
            var intersected = false;

            // bottom
            {
                var tprime = ((-height / 2) - point[1]) / direction[1];

                if (tprime >= t1 && tprime <= t) {
                    var x = point[0] + tprime * direction[0];
                    var z = point[2] + tprime * direction[2];

                    vec3.set(hit.point, x, -height / 2, z);
                    vec3.set(hit.normal, 0, -1, 0);

                    t = tprime;
                    intersected = true;
                }
            }

            // top
            {
                var tprime = ((height / 2) - point[1]) / direction[1];

                if (tprime >= t1 && tprime <= t) {
                    var x = point[0] + tprime * direction[0];
                    var z = point[2] + tprime * direction[2];

                    vec3.set(hit.point, x, height / 2, z);
                    vec3.set(hit.normal, 0, -1, 0);

                    t = tprime;
                    intersected = true;
                }
            }

            // we hit the top or bottom of the cylinder if t has changed
            return t != t2;
        }
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
