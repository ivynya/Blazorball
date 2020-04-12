window.fullscreen = () => {
    document.getElementById("client").requestFullscreen();
}

var clientCanvas;
window.initcontrols = () => {
    clientCanvas = document.getElementById("controlsCanvas");
}