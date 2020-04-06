var canvas;

// World static
var halfWidth = window.innerWidth / 2;
var halfHeight = window.innerHeight / 2;

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
    engine.world.gravity.y = 0;

    // Create bounding box
    var top = Bodies.rectangle(halfWidth, 0, window.innerWidth, 1, { isStatic: true });
    var bottom = Bodies.rectangle(halfWidth, window.innerHeight, window.innerWidth, 1, { isStatic: true });
    var left = Bodies.rectangle(0, halfHeight, 1, window.innerHeight, { isStatic: true });
    var right = Bodies.rectangle(window.innerWidth, halfHeight, 1, window.innerHeight, { isStatic: true });
    World.add(engine.world, [top, bottom, left, right]);

    // Create ball object
    var ball = Bodies.circle(halfWidth, halfHeight, 50);

    // add bodies to the world
    World.add(engine.world, [boxA, boxB, ball]);

    Matter.Body.applyForce(ball, ball.position, { x: 0.1, y: 0 });

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);
}