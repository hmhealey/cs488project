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
    this.particleCount = 0;

    // properties of individual particles
    this.particles = new Array(Math.ceil(this.maxParticleCount));
    for (var i = 0; i < this.particles.length; i++) {
        this.particles[i] = new Particle();
    }

    // buffer objects and arrays used to pass properties to OpenGL
    this.offsets = gl.createBuffer();
    //this.colours = gl.createBuffer(); // TODO implement changing colours for particles?

    this.positions = new Float32Array(this.maxParticleCount * 3);
};

ParticleEmitter.prototype = Object.create(Entity);
ParticleEmitter.prototype.constructor = ParticleEmitter;

// use a separate shader than the rest of the drawing since we need some additional features
// when drawing points or instances
ParticleEmitter.shader = null;

ParticleEmitter.prototype.draw = function(shader) {
    if (this.particleCount > 0 && ParticleEmitter.shader != null) {
        ParticleEmitter.shader.bind();

        // super sketchy setup of camera
        ParticleEmitter.shader.setCamera(level.mainCamera);

        // set model matrix
        ParticleEmitter.shader.setModelMatrix(this.transform.getLocalToWorldMatrix());

        gl.bindBuffer(gl.ARRAY_BUFFER, this.offsets);

        // update stored particle positions
        gl.bufferData(gl.ARRAY_BUFFER, this.positions.subarray(0, this.particleCount * 3), gl.STREAM_DRAW);

        ParticleEmitter.shader.enableVertexAttribute("position", this.offsets);

        gl.drawArrays(gl.POINTS, 0, this.particleCount);

        ParticleEmitter.shader.disableVertexAttribute("position");
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        ParticleEmitter.shader.release();

        // rebind the normal shader so that other drawing still works
        shader.bind();
    }

    // we may want to consider recursing on children?
};

ParticleEmitter.prototype.update = function() {
    var time = new Date().getTime();
    var delta = time - lastTick;

    // keep track of how many particles are currently alive
    this.particleCount = 0;

    // update properties of particles
    for (var i = 0; i < this.maxParticleCount; i++) {
        var particle = this.particles[i];

        // only bother updating the particle if it's alive
        if (particle.life > 0) {
            vec3.add(particle.position, particle.position, particle.velocity);
            vec3.add(particle.velocity, particle.velocity, this.gravity);

            particle.life -= delta;

            // copy the particle position into a new array that we'll pass to the shader
            this.positions[this.particleCount * 3] = particle.position[0];
            this.positions[this.particleCount * 3 + 1] = particle.position[1];
            this.positions[this.particleCount * 3 + 2] = particle.position[2];

            this.particleCount += 1;
        }
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
    // TODO change how we store this since it's currently shared between instances
    var lastParticleIndex = 0;

    return function() {
        for (var i = lastParticleIndex + 1; i < this.maxParticleCount; i++) {
            if (this.particles[i].life <= 0) {
                lastParticleIndex = i;
                return i;
            }
        }

        for (var i = 0; i <= lastParticleIndex; i++) {
            if (this.particles[i].life <= 0) {
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

    // scale our orientation vector by speed to get the final velocity
    vec3.scale(velocity, velocity, (this.maxSpawnSpeed - this.minSpawnSpeed) * Math.random() + this.minSpawnSpeed);

    // actually set particle properties
    vec3.copy(this.particles[index].position, this.transform.position);
    vec3.copy(this.particles[index].velocity, velocity);

    this.particles[index].life = this.maxAge;
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

function Particle() {
    this.position = vec3.create();
    this.velocity = vec3.create();
    this.life = 0;
};
