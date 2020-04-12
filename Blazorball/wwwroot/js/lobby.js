
// World static
var engine;
var halfWidth = window.innerWidth / 2;
var halfHeight = window.innerHeight / 2;

// World dynamic
var playerDict = {};
var ball;

window.gamestart = (playerList) => {
    // Get game canvas
    var gameCanvas = document.getElementById("gameCanvas");

    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies;

    // create an engine
    engine = Engine.create();

    // create a renderer
    var render = Render.create({
        canvas: gameCanvas,
        engine: engine,
        options: {
            height: window.innerHeight,
            width: window.innerWidth,
            showVelocity: true
        }
    });

    // World options
    engine.world.gravity.y = 0;

    // Create bounding box
    World.add(engine.world, [
        Bodies.rectangle(halfWidth, 0, window.innerWidth, 1, { isStatic: true }),
        Bodies.rectangle(halfWidth, window.innerHeight, window.innerWidth, 1, { isStatic: true }),
        Bodies.rectangle(0, halfHeight, 1, window.innerHeight, { isStatic: true }),
        Bodies.rectangle(window.innerWidth, halfHeight, 1, window.innerHeight, { isStatic: true })
    ]);

    // Create ball object
    ball = Bodies.circle(halfWidth, halfHeight, 50);

    // add bodies to the world
    World.add(engine.world, [ball]);

    var players = JSON.parse(playerList);
    players.forEach((player) => {
        var playerObject = Bodies.circle((3 / 2) * halfWidth, halfHeight, 70);
        World.add(engine.world, playerObject);
        playerDict[player.Id] = playerObject;
    });

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);
}

function push() {
    Matter.Body.applyForce(ball, ball.position, { x: 0.1, y: 0 });
}