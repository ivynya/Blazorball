var instance;

window.createref = (inst) => {
    instance = inst;
}

window.onunload = disconnect;
function disconnect() {
    if (instance) return instance.invokeMethodAsync('Disconnect');
}