var instance;

window.createref = (inst) => {
    instance = inst;
}

window.onunload = disconnect;
function disconnect() {
    return instance.invokeMethodAsync('Disconnect');
}