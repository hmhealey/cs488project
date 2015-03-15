var onFramerate = null

var onFrameRendered = (function() {
    var lastSecond = -1;
    var frames = 0;
    var fps = 0;

    return function() {
        var now = new Date().getTime();

        if (lastSecond != -1) {
            if (now - lastSecond <= 1000) {
                frames += 1;
            } else {
                lastSecond = lastSecond + 1000;
                fps = frames;
                frames = 0;
            }
        } else {
            lastSecond = now;
        }

        if (onFramerate != null) {
            onFramerate(fps);
        }
    };
})();
