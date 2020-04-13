window.fullscreen = () => {
    document.getElementById("client").requestFullscreen();
}

var clientCanvas;
window.initcontrols = () => {
    clientCanvas = document.getElementById("controlsCanvas");
    var maxSize = Math.min(window.innerHeight, window.innerWidth);
    clientCanvas.width = maxSize;
    clientCanvas.height = maxSize;
}