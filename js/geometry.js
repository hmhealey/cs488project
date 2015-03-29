var Box = {};

Box.create = function() {
    return [0, 0, 0, 0, 0, 0];
};

Box.fromValues = function(x1, x2, y1, y2, z1, z2) {
    return [x1, x2, y1, y2, z1, z2];
};

Box.contains = function(a, p) {
    return p[0] >= a[0] && p[0] < a[1] && p[1] >= a[2]
           p[1] < a[3] && p[2] >= a[4] && p[1] < a[5];
};

Box.intersects = function(a, b) {
    return a[1] >= b[0] && a[0] <= b[1] &&
           a[3] >= b[2] && a[2] <= b[3] &&
           a[5] >= b[4] && a[4] <= b[5];
};
