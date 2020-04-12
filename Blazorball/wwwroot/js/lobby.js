
// World
var engine;
var playerDict = {};
var ball;

window.gamestart = (playerList, teamCountA, teamCountB) => {
    // Get game canvas and window info
    var gameCanvas = document.getElementById("gameCanvas");
    var halfWidth = window.innerWidth / 2;
    var halfHeight = window.innerHeight / 2;

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
            wireframes: false,
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
    ball = Bodies.circle(halfWidth, halfHeight, 40, { render: { fillStyle: 'white' } });

    // add bodies to the world
    World.add(engine.world, [ball]);

    var players = JSON.parse(playerList);
    var indexA = 1, indexB = 1;
    var teamAHeight = window.innerHeight / (teamCountA + 1);
    var teamBHeight = window.innerHeight / (teamCountB + 1);
    players.forEach((player) => {
        var playerObject;
        if (player.Team == 1) {
            var xPos = (1 / 2 * halfWidth), yPos = (teamAHeight * indexA);
            playerObject = Bodies.polygon(xPos, yPos, 2 + indexA, 60, { render: { fillStyle: 'orange' }, angle: 3.14 });
            indexA++;
        }
        else if (player.Team == 2) {
            var xPos = (3 / 2 * halfWidth), yPos = (teamBHeight * indexB);
            playerObject = Bodies.polygon(xPos, yPos, 2 + indexB, 60, { render: { fillStyle: 'teal' } });
            indexB++;
        }
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