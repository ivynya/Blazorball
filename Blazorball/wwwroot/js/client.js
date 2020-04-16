window.fullscreen = () => {
    document.getElementById("client").requestFullscreen();
}

var clientCanvas, canvasCenter = { x: 0, y: 0 }, ctx;
window.initcontrols = () => {
    clientCanvas = document.getElementById("controlsCanvas");
    var maxSize = Math.min(window.innerHeight, window.innerWidth, 700);
    clientCanvas.width = maxSize;
    clientCanvas.height = maxSize;

    canvasCenter = { x: maxSize / 2, y: maxSize / 2 };

    if (clientCanvas.getContext)
        ctx = clientCanvas.getContext("2d");
    if (ctx) {
        clientCanvas.addEventListener('mousedown', sketchpad_mouseDown, false);
        clientCanvas.addEventListener('mousemove', sketchpad_mouseMove, false);
        window.addEventListener('mouseup', sketchpad_mouseUp, false);

        clientCanvas.addEventListener('touchstart', sketchpad_touchStart, false);
        clientCanvas.addEventListener('touchend', sketchpad_touchEnd, false);
        clientCanvas.addEventListener('touchmove', sketchpad_touchMove, false);
    }
}

// Debounce bool
var canSend = true;

// Use interop ref from interop.js
function pushVector(vx, vy) {
    console.log(vx);
    console.log(vy);
    if (instance && canSend) {
        instance.invokeMethodAsync('PushVector', vx, vy);
        canSend = false;
        setTimeout(() => {
            canSend = true;
        }, 1000 / (1 - Math.max(vx, vy)));
    }
}

// Code I wrote for last year's math project, adapted for
// a completely unrelated purpose. Now this is pod racing!

var mouseX, mouseY, mouseDown;
var vectorX, vectorY;

// Draws a dot and line on canvas and calculates vector from center
function drawDot(ctx, x, y, size) {
    // Clear canvas
    ctx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);

    // Draw a dot
    ctx.fillStyle = "rgba(0, 255, 0, 1)";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    // Draw a line
    ctx.strokeStyle = "rgba(0, 255, 0, 1)";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(canvasCenter.x, canvasCenter.y);
    ctx.closePath();
    ctx.stroke();

    // Calculate unit vector from center
    vectorX = (x - canvasCenter.x) / clientCanvas.width;
    vectorY = (y - canvasCenter.y) / clientCanvas.height;
}

// Sketchpad mouse functions
function sketchpad_mouseDown() {
    mouseDown = 1;
    drawDot(ctx, mouseX, mouseY, 8);
}

function sketchpad_mouseUp() {
    mouseDown = 0;

    // Clear canvas
    ctx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);

    // Push vector to server and clear
    if (vectorX && vectorY) {
        pushVector(vectorX, vectorY);
        vectorX = null;
        vectorY = null;
    }
}

function sketchpad_mouseMove(e) {
    getMousePos(e);

    if (mouseDown === 1) {
        drawDot(ctx, mouseX, mouseY, 8);
    }
}

function getMousePos(e) {
    if (!e)
        e = event;

    mouseX = e.layerX;
    mouseY = e.layerY; // if you added - getOffset() to this, it would function on Edge. However, it does break it for literally everything else...
}

// Sketchpad touch functions
function sketchpad_touchStart() {
    getTouchPos();
    drawDot(ctx, touchX, touchY, 8);
    event.preventDefault();
}

function sketchpad_touchEnd() {
    // Clear canvas
    ctx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);

    // Push vector
    if (vectorX && vectorY) {
        pushVector(vectorX, vectorY);
        vectorX = null;
        vectorY = null;
    }
}

function sketchpad_touchMove(e) {
    getTouchPos(e);
    drawDot(ctx, touchX, touchY, 8);
    event.preventDefault();
}

function getTouchPos(e) {
    if (!e)
        e = event;

    if (e.touches) {
        if (e.touches.length === 1) {
            var touch = e.touches[0];
            var canvasRect = clientCanvas.getBoundingClientRect();

            touchX = touch.pageX - canvasRect.left;
            touchY = touch.pageY - canvasRect.top;
        }
    }
}