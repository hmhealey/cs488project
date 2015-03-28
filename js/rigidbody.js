function RigidBody(args) {
    args = args || {};

    this.entity = args['entity'] || null;

    this.velocity = args['velocity'] || vec3.create();
};

RigidBody.prototype.draw = function() { };

RigidBody.prototype.update = function(time) {
    var collider = this.entity.getComponent(BoxCollider);

    if (collider) {
        // TODO figure out a better way to refer back to the base level
        var colliders = level.root.getComponentsInChildren(BoxCollider);

        var transform = this.entity.transform;

        var position = transform.getWorldPosition();

        var left = transform.position[0] - collider.width / 2;
        var right = transform.position[0] + collider.width / 2;

        var dx = this.velocity[0];
        var dy = this.velocity[1];
        var dz = this.velocity[2];

        var newx = transform.position[0] + dx;
        var newy = transform.position[1] + dy;
        var newz = transform.position[2] + dz;

        /*for (var i = 0; i < colliders.length; i++) {
            var other = colliders[i];

            var otherx = other.entity.transform.position[0];
            var othery = other.entity.transform.position[1];
            var otherz = other.entity.transform.position[2];

            if (other != collider) {
                //if (newx - collider.width / 2 < otherx - other.width / 2 && newx - collider.width / 2 >= otherx + other.width / 2) {
            }
        }*/
    } else {
        this.entity.transform.translate(this.velocity);
    }
};
