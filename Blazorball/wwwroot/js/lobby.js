
// World
var engine;
var playerDict = {};
var ball;

var acceptPlayerInput = false;
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

    // Create goal boxes
    var hSpacing = window.innerHeight / 8;
    var wSpacing = window.innerWidth / 8;
    World.add(engine.world, [
        // Left goal
        Bodies.rectangle(0, hSpacing * 3, wSpacing, 2, { isStatic: true, render: { fillStyle: 'white' } }),
        Bodies.rectangle(0, 4 * hSpacing + 1, wSpacing, hSpacing * 2, { isStatic: true, render: { fillStyle: '#f80a' }, collisionFilter: { mask: -2, group: 1 } }),
        Bodies.rectangle(0, hSpacing * 5, wSpacing, 2, { isStatic: true, render: { fillStyle: 'white' } }),
        // Right goal
        Bodies.rectangle(window.innerWidth, hSpacing * 3, wSpacing, 2, { isStatic: true, render: { fillStyle: 'white' } }),
        Bodies.rectangle(window.innerWidth, 4 * hSpacing + 1, wSpacing, hSpacing * 2, { isStatic: true, render: { fillStyle: '#38ca' }, collisionFilter: { mask: -2, group: 1 } }),
        Bodies.rectangle(window.innerWidth, hSpacing * 5, wSpacing, 2, { isStatic: true, render: { fillStyle: 'white' } }),
    ]);

    // Create ball object
    ball = Bodies.circle(halfWidth, halfHeight, 40, { render: { fillStyle: 'white' }, restitution: 0.7 });
    World.add(engine.world, [ball]);

    // Add player objects to world
    var players = JSON.parse(playerList);
    var indexA = 1, indexB = 1;
    var teamAHeight = window.innerHeight / (teamCountA + 1);
    var teamBHeight = window.innerHeight / (teamCountB + 1);
    players.forEach((player) => {
        var playerObject;
        if (player.Team == 1) {
            var xPos = (1 / 2 * halfWidth), yPos = (teamAHeight * indexA);
            playerObject = Bodies.polygon(xPos, yPos, 2 + indexA, 70, { render: { fillStyle: 'orange' }, angle: 3.14, restitution: 1 });
            indexA++;
        }
        else if (player.Team == 2) {
            var xPos = (3 / 2 * halfWidth), yPos = (teamBHeight * indexB);
            playerObject = Bodies.polygon(xPos, yPos, 2 + indexB, 70, { render: { fillStyle: 'teal' }, restitution: 1 });
            indexB++;
        }
        World.add(engine.world, playerObject);
        playerDict[player.Id] = playerObject;
    });

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);

    // Countdown text
    var ct = 2;
    var countdown = setInterval(() => {
        if (ct != 0)
            document.getElementById("countdownText").innerText = ct;
        else {
            document.getElementById("countdownText").innerText = "Go!";
            clearInterval(countdown);
            setTimeout(() => {
                document.getElementById("countdownText").style.display = "none";
                acceptPlayerInput = true;
                runGameTimer();
            }, 1500);
        }
        ct--;
    }, 1500);
}

var tRemaining = 180;
function runGameTimer() {
    var gameTimer = setInterval(() => {
        tRemaining--;
        let min = Math.floor(tRemaining / 60);
        let sec = (tRemaining % 60).toString().padStart(2, '0');
        document.getElementById("timer").innerText = `${min}:${sec}`;
        if (tRemaining === 0) {
            clearInterval(gameTimer);
        }
    }, 1000);
}

window.applyplayerforce = (playerID, xF, yF) => {
    if (!acceptPlayerInput) return;
    var playerObj = playerDict[playerID];
    Matter.Body.applyForce(playerObj, playerObj.position, { x: xF, y: yF });
}