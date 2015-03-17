console.log(root);

var blank = new Texture();
blank.setImageFromPath("white.png");
textures.push(blank); // we can access global variables here

var notGrass = new Material({
    diffuse: vec4.fromValues(0.5, 0.1, 0.9, 1.0),
    shininess: 0,
    texture: blank
});

var notGround = new Entity({name: "notGround", mesh: Mesh.makeSquare(1), material: notGrass});
notGround.translate([0, 0, -10]);
notGround.rotate("x", -45);
notGround.scale([10, 10, 1]);
root.addChild(notGround);

return root;
