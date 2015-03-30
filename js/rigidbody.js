function RigidBody(args) {
    args = args || {};

    this.entity = args['entity'] || null;

    this.velocity = args['velocity'] || vec3.create();
};

RigidBody.prototype.draw = function() { };

RigidBody.prototype.update = function(time) {
    if (vec3.squaredLength(this.velocity) != 0) {
        // keep the velocity independent of the tick rate
        var velocity = vec3.scale(vec3.create(), this.velocity, 1 / TICK_RATE);

        var collider = this.entity.getComponent(Collider);

        if (collider) {
            // TODO figure out a better way to refer back to the base level
            var colliders = level.root.getComponentsInChildren(Collider);

            // TODO holy crap this is awful, but I guess it works thanks to our high tick rate
            for (var dir = 0; dir < 3; dir++) {
                if (velocity[dir] == 0) continue;

                var delta = [
                    dir == 0 ? velocity[0] : 0,
                    dir == 1 ? velocity[1] : 0,
                    dir == 2 ? velocity[2] : 0
                ];

                var collided = false;

                for (var i = 0; i < colliders.length; i++) {
                    var other = colliders[i];
                    if (collider != other && collider.collidesWith(other, delta)) {
                        collided = true;
                        break;
                    }
                }

                if (!collided) {
                    this.entity.transform.translate(delta);
                }
            }
        } else {
            this.entity.transform.translate(this.velocity);
        }
    }
};
