function ParticleEmitter(args) {
    args = args || {};

    Component.call(this, args);

    // how long individual particles will live for
    this.maxAge = args['maxAge'] || 500;

    // maintain a separate mesh and material for particles
    this.mesh = args['mesh'] || null;
    this.material = args['material'] || null;

    // used as alternatives to material/mesh for point particles
    this.colour = args['colour'] || vec4.fromValues(1, 1, 1, 1);
    this.pointSize = args['pointSize'] || 1;

    var time = getTime();
    this.spawnEnd = 'spawnDuration' in args ? time + args['spawnDuration'] : 0;
    this.destroyAfterSpawning = args['destroyAfterSpawning'] || false;

    this.lastSpawn = time;
    this.spawnRate = args['spawnRate'] || 10;

    this.minSpawnSpeed = args['minSpawnSpeed'] || args['spawnSpeed'] || 1;
    this.maxSpawnSpeed = args['maxSpawnSpeed'] || args['spawnSpeed'] || 1;

    this.spawnOffset = args['spawnOffset'] || vec3.create();

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
    this.maxParticleCount = args['maxParticleCount'] || Math.ceil(this.maxAge / this.spawnRate);
    this.particleCount = 0;

    // the next index that we'll check when we need to spawn a new particle
    this.nextParticleIndex = 0;

    // properties of individual particles
    this.particles = new Array(this.maxParticleCount);
    for (var i = 0; i < this.particles.length; i++) {
        this.particles[i] = new Particle();
    }

    // buffer objects and arrays used to pass properties to OpenGL
    this.offsetBuffer = gl.createBuffer();
    this.colourBuffer = gl.createBuffer();

    this.positions = new Float32Array(this.maxParticleCount * 3);
    this.colours = new Float32Array(this.maxParticleCount * 4);
};

ParticleEmitter.prototype = Object.create(Component.prototype);
ParticleEmitter.prototype.constructor = ParticleEmitter;

ParticleEmitter.prototype.update = function(time) {
    // keep track of how many particles are currently alive
    this.particleCount = 0;

    // update properties of particles
    for (var i = 0; i < this.maxParticleCount; i++) {
        var particle = this.particles[i];

        // only bother updating the particle if it's alive
        if (particle.life > 0) {
            vec3.scaleAndAdd(particle.position, particle.position, particle.velocity, 1 / TICK_RATE);
            vec3.scaleAndAdd(particle.velocity, particle.velocity, this.gravity, 1 / TICK_RATE);

            particle.life -= TICK_RATE;

            // copy the particle position and colour into a new array that we'll pass to the shader
            this.positions[this.particleCount * 3] = particle.position[0];
            this.positions[this.particleCount * 3 + 1] = particle.position[1];
            this.positions[this.particleCount * 3 + 2] = particle.position[2];

            this.colours[this.particleCount * 4] = particle.colour[0];
            this.colours[this.particleCount * 4 + 1] = particle.colour[1];
            this.colours[this.particleCount * 4 + 2] = particle.colour[2];
            this.colours[this.particleCount * 4 + 3] = particle.colour[3];

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
    } else {
        if (this.destroyAfterSpawning && this.particleCount == 0) {
            this.destroy();
        }
    }
};

ParticleEmitter.prototype.cleanup = function(shader) {
    if (this.offsetBuffer != null) {
        gl.deleteBuffer(this.offsetBuffer);
    }

    if (this.colourBuffer != null) {
        gl.deleteBuffer(this.colourBuffer);
    }
};

ParticleEmitter.prototype.getNextParticleIndex = function() {
    // search through the particle array linearly until we find the next available slot to use
    for (var i = this.nextParticleIndex; i < this.maxParticleCount; i++) {
        if (this.particles[i].life <= 0) {
            this.nextParticleIndex = i + 1;
            return i;
        }
    }

    for (var i = 0; i < this.nextParticleIndex; i++) {
        if (this.particles[i].life <= 0) {
            this.nextParticleIndex = i + 1;
            return i;
        }
    }

    // we've run out of space for particles so just override the first particle
    console.log("ParticleEmitter.getAvailableIndex - Ran out of space in the particle array");
    return 0;
};

ParticleEmitter.prototype.spawnParticle = function() {
    // use the next available slot in the particle arrays to store this
    var index = this.getNextParticleIndex();

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
    vec3.add(this.particles[index].position, this.entity.transform.position, this.spawnOffset);
    console.log("spawning at " + vec3.str(this.particles[index].position));
    vec3.copy(this.particles[index].velocity, velocity);

    this.particles[index].life = this.maxAge;

    if (this.colour != "random") {
        this.particles[index].colour = this.colour;
    } else {
        this.particles[index].colour = vec4.random(vec4.create());
    }
};

ParticleEmitter.prototype.emitFor = function(spawnDuration, destroyAfterSpawning) {
    var time = getTime();
    this.spawnEnd = time + spawnDuration;
    this.lastSpawn = time;
    this.destroyAfterSpawning = destroyAfterSpawning || false;
};

ParticleEmitter.prototype.emitUntil = function(spawnEnd, destoryAfterSpawning) {
    this.spawnEnd = spawnEnd;
    this.lastSpawn = getTime();
    this.destroyAfterSpawning = destroyAfterSpawning || false;
};

ParticleEmitter.prototype.startEmitting = function() {
    this.spawnEnd = -1;
    this.lastSpawn = getTime();
};

ParticleEmitter.prototype.stopEmitting = function() {
    this.spawnEnd = 0;
};

function Particle() {
    this.position = vec3.create();
    this.velocity = vec3.create();

    this.life = 0;

    this.colour = vec4.create();
};

function ParticleRenderer(args) {
    Renderer.call(this, args);
};

ParticleRenderer.prototype = Object.create(Renderer.prototype);
ParticleRenderer.prototype.constructor = ParticleRenderer;

ParticleRenderer.prototype.draw = function(light, ambient) {
    var emitters = this.entity.getComponents(ParticleEmitter);
    var numEmitters = emitters.length;

    for (var i = 0; i < numEmitters; i++) {
        this.drawFor(emitters[i], light, ambient);
    }
};

ParticleRenderer.prototype.drawFor = function(emitter, light, ambient) {
    var mesh = emitter.mesh;
    var material = emitter.material;

    var shader;
    if (mesh) {
        if (material.shininess) {
            shader = Shader.getShader("particles/phong");
        } else {
            shader = Shader.getShader("particles/diffuse");
        }
    } else {
        shader = Shader.getShader("particles/point");
    }

    if (emitter.particleCount > 0 && shader.linked) {
        shader.bind();

        // super sketchy setup of camera
        shader.setCamera(level.mainCamera);

        // set model matrix
        shader.setModelMatrix(this.entity.transform.getLocalToWorldMatrix());

        shader.updateMatrices();

        // update particle properties
        shader.enableVertexAttribute("offset", emitter.offsetBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, emitter.positions.subarray(0, emitter.particleCount * 3), gl.STREAM_DRAW);

        if (material) {
            material.apply(shader);
        } else {
            shader.enableVertexAttribute("colour", emitter.colourBuffer, 4);
            gl.bufferData(gl.ARRAY_BUFFER, emitter.colours.subarray(0, emitter.particleCount * 4), gl.STREAM_DRAW);
        }

        if (light) {
            light.apply(shader, ambient);
        } else {
            Light.applyNoLight(shader, ambient);
        }

        if (mesh) {
            // set up the attributes that are per-instance (and shared by all vertices)
            ext.vertexAttribDivisorANGLE(shader.getAttributeLocation("offset"), 1);

            mesh.enableAttributes(shader);

            // slightly duplicates mesh code, but that's okay for now since I don't want to deal with
            // this extension all over the place
            if (!mesh.indexBuffer) {
                ext.drawArraysInstancedANGLE(mesh.type, 0, emitter.mesh.numVertices, emitter.particleCount);
            } else {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);

                ext.drawElementsInstancedANGLE(mesh.type, mesh.numIndices, gl.UNSIGNED_INT, 0, emitter.particleCount);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            }

            mesh.disableAttributes(shader);

            // for some reason, we need to disable these or it affects other shaders somehow
            ext.vertexAttribDivisorANGLE(shader.getAttributeLocation("offset"), 0);

            if (!material) {
                ext.vertexAttribDivisorANGLE(shader.getAttributeLocation("colour"), 0);
            }
        } else {
            shader.setUniformFloat("pointSize", emitter.pointSize);

            gl.drawArrays(gl.POINTS, 0, emitter.particleCount);
        }

        shader.disableVertexAttribute("offset");
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        shader.release();
    }
};
