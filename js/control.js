function PlayerController(args) {
    args = args || [];

    this.speed = args['speed'] || 0;
    this.rotationSpeed = args['rotationSpeed'] || 0;

    this.jumpSpeed = args['jumpSpeed'] || 0;

    this.noclip = args['noclip'] || false;

    this.walkSoundPlaying = false;
    this.walkSounds = [
        new Audio("sounds/step1.wav"),
        new Audio("sounds/step2.wav"),
        new Audio("sounds/step3.wav"),
        new Audio("sounds/step4.wav")
    ];
    for (var i = 0; i < this.walkSounds.length; i++) {
        attachEvent(this.walkSounds[i], "ended", (function(controller, _i) {
            return function() {
                this.currentTime = 0;

                var next = (_i + 1) % controller.walkSounds.length;
                controller.walkSounds[next].currentTime = -100;
                controller.walkSounds[next].play();
            }
        })(this, i));
    }

    this.jumpSoundPlayed = false;
    this.jumpSound = new Audio(args['jumpSound'] || "sounds/plyrjmp8.wav");

    this.willPlayLandSound = false;
    this.landSound = new Audio(args['landSound'] || "sounds/land.wav");
};

PlayerController.prototype.update = function(entity) {
    // keyboard/mouse rotation
    var dpitch = 0;
    var dyaw = 0;

    if (Input.getKey(38) && !Input.getKey(40)) {
        dpitch = 1;
    } else if (Input.getKey(40) && !Input.getKey(38)) {
        dpitch = -1;
    }

    if (Input.getKey(37) && !Input.getKey(39)) {
        dyaw = 1;
    } else if (Input.getKey(39) && !Input.getKey(37)) {
        dyaw = -1;
    }

    if (Input.Mouse.isLocked()) {
        dpitch += Input.Mouse.deltaY * -0.06;
        dyaw += Input.Mouse.deltaX * -0.06;
    }

    if (dpitch != 0) {
        entity.transform.rotate('x', dpitch);
    }
    if (dyaw != 0) {
        entity.transform.rotate('y', dyaw, 'world');
    }

    // keyboard movement
    var rigidBody = entity.getComponent(RigidBody);

    var dz = 0;
    var dy = 0;
    var dx = 0;

    if (Input.getKey(87) && !Input.getKey(83)) {
        dz = -1;
    } else if (Input.getKey(83) && !Input.getKey(87)) {
        dz = 1;
    }
    
    if (Input.getKey(65) && !Input.getKey(68)) {
        dx = -1;
    } else if (Input.getKey(68) && !Input.getKey(65)) {
        dx = 1;
    }

    if (dx != 0 || dz != 0) {
        var velocity = vec3.fromValues(dx, 0, dz);
        vec3.transformQuat(velocity, velocity, entity.transform.rotation);

        if (rigidBody.useGravity) {
            velocity[1] = 0;
        }

        vec3.normalize(velocity, velocity);
        vec3.scale(velocity, velocity, this.speed);

        rigidBody.velocity[0] = velocity[0];
        rigidBody.velocity[2] = velocity[2];
    } else {
        rigidBody.velocity[0] = 0;
        rigidBody.velocity[2] = 0;
    }

    // jumping
    if (rigidBody.useGravity && rigidBody.velocity[1] == 0 && Input.getKeyDown(32)) {
        rigidBody.velocity[1] = this.jumpSpeed;
    }

    // sound effects
    if (rigidBody.velocity[1] == 0) {
        // on the ground
        if (!this.walkSoundPlaying && (rigidBody.velocity[0] != 0 || rigidBody.velocity[2] != 0)) {
            this.walkSounds[Math.floor(Math.random() * this.walkSounds.length)].play();

            this.walkSoundPlaying = true;
        } else if (this.walkSoundPlaying && rigidBody.velocity[0] == 0 && rigidBody.velocity[1] == 0) {
            var numWalkSounds = this.walkSounds.length;
            for (var i = 0; i < numWalkSounds; i++) {
                this.walkSounds[i].currentTime = 0;
                this.walkSounds[i].pause();
            }
            this.walkSoundPlaying = false;
        }

        if (this.jumpSoundPlayed) {
            this.jumpSoundPlayed = false;
        }

        if (this.willPlayLandSound) {
            this.landSound.play();

            this.willPlayLandSound = false;
        }
    } else if (rigidBody.velocity[1] != 0) {
        if (this.walkSoundPlaying) {
            var numWalkSounds = this.walkSounds.length;
            for (var i = 0; i < numWalkSounds; i++) {
                this.walkSounds[i].currentTime = 0;
                this.walkSounds[i].pause();
            }
            this.walkSoundPlaying = false;
        }

        if (rigidBody.velocity[1] > 0) {
            if (!this.jumpSoundPlayed) {
                this.jumpSound.play();

                this.jumpSoundPlayed = true;
            }
        } else if (rigidBody.velocity[1] <= -this.jumpSpeed) {
            this.willPlayLandSound = true;
        }
    }

    // interaction
    if (Input.Mouse.getButtonDown(0)) {
        var hit = new RaycastHit();

        var filter = function(collider) {
            return collider.entity != entity && collider.entity.name != "ground" && collider.entity.name != "groundCollider";
        };

        // this is sketchy, but it works since the controller is no longer attached directly to the main camera
        if (level.raycast(level.mainCamera.transform.getWorldPosition(), entity.transform.getForward(), hit, filter)) {
            var collider = hit.collider;

            var emitter = level.root.addComponent(new ParticleEmitter({
                spawnOffset: hit.point,
                spawnOrientationRandomness: 60,
                minSpawnSpeed: 0.4,
                maxSpawnSpeed: 0.6,
                spawnRate: 25,
                gravity: vec3.fromValues(0, -0.4, 0),
                maxAge: 500,
                mesh: Mesh.makeCube(0.15),
                material: collider.entity.material
            }));

            emitter.emitFor(150, true);

            if (!level.root.getComponent(ParticleRenderer)) {
                level.root.addComponent(new ParticleRenderer());
            }

            console.log("bang! you hit " + hit.collider.entity.name);
            console.log(hit.point);
            console.log(hit.normal);
            //hit.collider.entity.destroy();
        } else {
            console.log("bang! you missed");
        }
    }
};
