var canvas;

window.gamestart = () => {
    canvas = document.getElementById("gameCanvas");

    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies;

    // create an engine
    var engine = Engine.create();

    // create a renderer
    var render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            height: window.innerHeight,
            width: window.innerWidth
        }
    });

    // World options
    engine.world.gravity.y = 0.2;

    // Create bounding box
    var top = Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 1, { isStatic: true });
    var bottom = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 1, { isStatic: true });
    var left = Bodies.rectangle(0, window.innerHeight / 2, 1, window.innerHeight, { isStatic: true });
    var right = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 1, window.innerHeight, { isStatic: true });
    World.add(engine.world, [top, bottom, left, right]);

    // create two boxes
    var boxA = Bodies.rectangle(800, 200, 80, 80);
    var boxB = Bodies.rectangle(450, 50, 80, 80);

    // add bodies to the world
    World.add(engine.world, [boxA, boxB]);

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);
}