function loadLevel(path, root) {
    var doLoadLevel = (function(_root) {
        return function(levelScript) {
            // a level file is defined as a function which takes a root node and constructs a level out of it
            new Function("root", levelScript).call(null, _root)
        };
    })(root);

    requestFile("levels/" + path + ".js", doLoadLevel, function() {
        console.log("Unable to load level " + path);
    });
};
