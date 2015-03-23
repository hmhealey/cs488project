function ParticleEmitter(args) {
    args = args || {};

    Entity.call(this, args);

    // how long individual particles will live for
    this.maxAge = args['maxAge'] || 500;

    //this.colour = args['colour'] || vec4.fromValues(1, 1, 1, 1); // TODO implement setting a colour as part of the emitter
    //this.shape = args['shape'] || null; // TODO implement particles that aren't just points

    //this.spawnRadius = args['spawnRadius'] || 0; // TODO implement randomness in spawn location

    var time = new Date().getTime();
    this.spawnEnd = 'spawnDuration' in args ? time + args['spawnDuration'] : 0;
    this.lastSpawn = time;
    this.spawnRate = args['spawnRate'] || 10;

    this.minSpawnSpeed = args['minSpawnSpeed'] || args['spawnSpeed'] || 1;
    this.maxSpawnSpeed = args['maxSpawnSpeed'] || args['spawnSpeed'] || 1;

    if ('spawnOrientation' in args) {
        if (args['spawnOrientation'].length == 3) {
            // spawnOrientation is a vector so we store a quaternion that'll rotate the y axis
            // to the provided orientation
            this.spawnOrientation = quat.create();
            quat.rotationTo(this.spawnOrientation, vec3.fromValues(0, 1, 0), args['spawnOrientation']);
        } else {
            // spawnOrientation is a quaternion
            this.spawnOrientation = args['spawnOrientation'];
        }
    } else {
        this.spawnOrientation = quat.create();
    }
    this.spawnOrientationRandomness = args['spawnOrientationRandomness'] || 0;

    this.gravity = args['gravity'] || vec3.fromValues(0, -0.981 / 60, 0); // 1 unit = 1 metre

    // we can either explicitly set the maximum number of particles or just infer it from the
    // max age and spawn rate (but pretend we spawn a bit faster than we actually do just to
    // make sure we don't run out of space)
    this.maxParticleCount = args['maxParticleCount'] || this.maxAge / (this.spawnRate - 2);

    // properties of individual particles
    this.offsets = gl.createBuffer();
    //this.colours = gl.createBuffer(); // TODO implement changing colours for particles?

    this.positions = new Float32Array(this.maxParticleCount * 3);
    this.velocities = new Float32Array(this.maxParticleCount * 3);
    this.ages = new Float32Array(this.maxParticleCount);
};

ParticleEmitter.prototype = Object.create(Entity);
ParticleEmitter.prototype.constructor = ParticleEmitter;

// use a separate shader than the rest of the drawing since we need some additional features
// when drawing points or instances
ParticleEmitter.shader = null;

ParticleEmitter.prototype.draw = function(shader) {
    if (this.positions.length > 0 && ParticleEmitter.shader != null) {
        ParticleEmitter.shader.bind();

        // super sketchy setup of camera
        ParticleEmitter.shader.setCamera(level.mainCamera);

        // set model matrix
        ParticleEmitter.shader.setModelMatrix(this.transform.getLocalToWorldMatrix());

        gl.bindBuffer(gl.ARRAY_BUFFER, this.offsets);

        // update stored particle positions
        // this could be improved by just keeping positions as a Float32Array and not reconstructing it constantly
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW);

        ParticleEmitter.shader.enableVertexAttribute("position", this.offsets);

        gl.drawArrays(gl.POINTS, 0, this.positions.length / 3);

        ParticleEmitter.shader.disableVertexAttribute("position");
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        ParticleEmitter.shader.release();
    }

    // rebind the normal shader so that other drawing still works
    shader.bind();

    // we may want to consider recursing on children?
};

ParticleEmitter.prototype.update = function() {
    var time = new Date().getTime();
    var delta = time - lastTick;

    // update the age of existing particles
    for (var i = 0; i < this.maxParticleCount; i++) {
        this.ages[i] += delta;
    }

    // update position/location of existing particles
    for (var i = 0; i < this.positions.length; i++) {
        // note that each entry is just a single component of a particle's position/velocity
        this.positions[i] += this.velocities[i];
        this.velocities[i] += this.gravity[i % 3];
    }

    // spawn new particles if necessary
    if (this.spawnEnd == -1 || time < this.spawnEnd) {
        // this won't go well if we pause and unpause the game
        while (time - this.lastSpawn >= this.spawnRate) {
            // actually spawn a particle
            this.spawnParticle();

            this.lastSpawn += this.spawnRate;
        }
    }
};

ParticleEmitter.prototype.cleanup = function(shader) {
    if (this.offsets != null) {
        gl.deleteBuffer(this.offsets);
    }

    if (this.colours != null) {
        gl.deleteBuffers(this.colours);
    }
};

// search through the particle array linearly until we find the next available slot to use
ParticleEmitter.prototype.getAvailableIndex = (function() {
    var lastParticleIndex = 0;

    return function() {
        for (var i = lastParticleIndex + 1; i < this.maxParticleCount; i++) {
            if (this.ages[i] >= this.maxAge) {
                lastParticleIndex = i;
                return i;
            }
        }

        for (var i = 0; i <= lastParticleIndex; i++) {
            if (this.ages[i] >= this.maxAge) {
                lastParticleIndex = i;
                return i;
            }
        }

        // we've run out of space for particles so just override the first particle
        console.log("ParticleEmitter.getAvailableIndex - Ran out of space in the particle array");
        return 0;
    };
})();

ParticleEmitter.prototype.spawnParticle = function() {
    // use the next available slot in the particle arrays to store this
    var index = this.getAvailableIndex();

    // set it's age to 0 since it's new
    this.ages[index] = 0;

    // set the particle's initial position to match that of the emitter
    this.positions[index * 3] = this.transform.position[0];
    this.positions[index * 3 + 1] = this.transform.position[1];
    this.positions[index * 3 + 2] = this.transform.position[2];

    // construct an initial velocity based on the emitter's spawn orientation and particle spawn speed
    var velocity = vec3.fromValues(0, 1, 0);
    vec3.transformQuat(velocity, velocity, this.spawnOrientation);
    
    if (this.spawnOrientationRandomness != 0) {
        // pick a random vector on the x-z plane as the axis
        var x = Math.random();
        var deltaAxis = vec3.fromValues(x, 0, Math.sqrt(1 - x * x));

        // randomly flip the components of the axis so that we cover all possible axes
        if (Math.random() > 0.5) deltaAxis[0] *= -1;
        if (Math.random() > 0.5) deltaAxis[2] *= -1;

        // and rotate around it to get our delta
        var angle = (1 - 2 * Math.random()) * this.spawnOrientationRandomness;
        var delta = quat.setAxisAngle(quat.create(), deltaAxis, angle * Math.PI / 180);
        vec3.transformQuat(velocity, velocity, delta)
    }

    vec3.scale(velocity, velocity, (this.maxSpawnSpeed - this.minSpawnSpeed) * Math.random() + this.minSpawnSpeed);

    this.velocities[index * 3] = velocity[0];
    this.velocities[index * 3 + 1] = velocity[1];
    this.velocities[index * 3 + 2] = velocity[2];
};

ParticleEmitter.prototype.emitFor = function(spawnDuration) {
    var time = new Date().getTime();
    this.spawnEnd = time + spawnDuration;
    this.lastSpawn = time;
};

ParticleEmitter.prototype.emitUntil = function(spawnEnd) {
    this.spawnEnd = spawnEnd;
    this.lastSpawn = new Date().getTime();
};

ParticleEmitter.prototype.startEmitting = function() {
    this.spawnEnd = -1;
    this.lastSpawn = new Date().getTime();
};

ParticleEmitter.prototype.stopEmitting = function() {
    this.spawnEnd = 0;
};
