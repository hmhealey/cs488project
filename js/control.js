function PlayerController(args) {
    args = args || [];

    this.speed = args['speed'] || 0;
    this.rotationSpeed = args['rotationSpeed'] || 0;

    this.noclip = args['noclip'] || false;
};

PlayerController.prototype.update = function(entity) {
    var dpitch = 0;
    var dyaw = 0;

    if (Input.isKeyDown(38) && !Input.isKeyDown(40)) {
        dpitch = 1;
    } else if (Input.isKeyDown(40) && !Input.isKeyDown(38)) {
        dpitch = -1;
    }

    if (Input.isKeyDown(37) && !Input.isKeyDown(39)) {
        dyaw = 1;
    } else if (Input.isKeyDown(39) && !Input.isKeyDown(37)) {
        dyaw = -1;
    }

    if (Input.Cursor.isLocked()) {
        dpitch += Input.Cursor.deltaY * -0.06;
        dyaw += Input.Cursor.deltaX * -0.06;
    }

    if (dpitch != 0) {
        entity.transform.rotate('x', dpitch);
    }
    if (dyaw != 0) {
        entity.transform.rotate('y', dyaw, 'world');
    }

    var dz = 0;
    var dy = 0;
    var dx = 0;

    if (Input.isKeyDown(87) && !Input.isKeyDown(83)) {
        dz = -1;
    } else if (Input.isKeyDown(83) && !Input.isKeyDown(87)) {
        dz = 1;
    }
    
    if (Input.isKeyDown(65) && !Input.isKeyDown(68)) {
        dx = -1;
    } else if (Input.isKeyDown(68) && !Input.isKeyDown(65)) {
        dx = 1;
    }

    if (dx != 0 || dy != 0 || dz != 0) {
        var dir = vec3.fromValues(dx, dy, dz);
        vec3.normalize(dir, dir);
        vec3.scale(dir, dir, this.speed);
        vec3.transformQuat(dir, dir, entity.transform.rotation);

        entity.transform.translate(dir);
    }

    var hit = new RaycastHit();

    if (level.raycast(entity.transform.getWorldPosition(), entity.transform.getForward(), hit)) {
        asdf.innerText = "looking at " + hit.collider.entity.name;
    } else {
        asdf.innerText = "";
    }
};
