
// World
var engine;
var ball;
var leftGoal, rightGoal;

// Game
var playerDict = {};
// Player reset info
var playerJson, tCA, tCB;
// In this file, red team = orange team
var orangeScore = 0, blueScore = 0;

// Disable player input until game starts
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

    // Create goal posts
    var hSpacing = window.innerHeight / 8;
    var wSpacing = window.innerWidth / 8;
    World.add(engine.world, [
        // Left goal
        Bodies.rectangle(0, hSpacing * 3, wSpacing, 2, { isStatic: true, render: { fillStyle: 'white' } }),
        Bodies.rectangle(0, hSpacing * 5, wSpacing, 2, { isStatic: true, render: { fillStyle: 'white' } }),
        // Right goal
        Bodies.rectangle(window.innerWidth, hSpacing * 3, wSpacing, 2, { isStatic: true, render: { fillStyle: 'white' } }),
        Bodies.rectangle(window.innerWidth, hSpacing * 5, wSpacing, 2, { isStatic: true, render: { fillStyle: 'white' } })
    ]);

    // Create and set goal boxes
    leftGoal = Bodies.rectangle(0, 4 * hSpacing + 1, wSpacing, hSpacing * 2, { isStatic: true, render: { fillStyle: '#f80a' }, collisionFilter: { mask: -2, group: 1 } });
    rightGoal = Bodies.rectangle(window.innerWidth, 4 * hSpacing + 1, wSpacing, hSpacing * 2, { isStatic: true, render: { fillStyle: '#38ca' }, collisionFilter: { mask: -2, group: 1 } });
    World.add(engine.world, [
        leftGoal, rightGoal
    ]);

    // Create ball object
    ball = Bodies.circle(halfWidth, halfHeight, 35, { render: { fillStyle: 'white' }, restitution: 0.7 });
    World.add(engine.world, [ball]);

    // Add player objects to world
    var players = JSON.parse(playerList);
    var indexA = 1, indexB = 1;
    var teamAHeight = window.innerHeight / (teamCountA + 1);
    var teamBHeight = window.innerHeight / (teamCountB + 1);
    players.forEach((player) => {
        var playerObject;
        if (player.Team == 1) {
            let xPos = (1 / 2 * halfWidth), yPos = (teamAHeight * indexA);
            playerObject = Bodies.polygon(xPos, yPos, 2 + indexA, 60, { render: { fillStyle: 'orange' }, angle: 3.14, restitution: 1 });
            indexA++;
        }
        else if (player.Team == 2) {
            let xPos = (3 / 2 * halfWidth), yPos = (teamBHeight * indexB);
            playerObject = Bodies.polygon(xPos, yPos, 2 + indexB, 60, { render: { fillStyle: 'teal' }, restitution: 1 });
            indexB++;
        }
        World.add(engine.world, playerObject);
        playerDict[player.Id] = playerObject;
    });

    // Set up global reset info -- SUPER JANK and last minute
    playerJson = players;
    tCA = teamCountA;
    tCB = teamCountB;

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);

    // Register ball goal event handler
    Matter.Events.on(render, 'afterRender', (event) => {
        let bX = ball.position.x;
        let bY = ball.position.y;
        if (bX < wSpacing * 0.5 && bY < hSpacing * 5 && bY > hSpacing * 3) {
            orangeScore++;
            updateScore(orangeScore, blueScore);
            triggerGoal();
        }
        else if (bX > wSpacing * 7.5 && bY < hSpacing * 5 && bY > hSpacing * 3) {
            blueScore++;
            updateScore(orangeScore, blueScore);
            triggerGoal();
        }
    });

    // Countdown text
    var ct = 2;
    var countdown = setInterval(() => {
        if (ct != 0)
            document.getElementById("overlayText").innerText = ct;
        else {
            document.getElementById("overlayText").innerText = "Go!";
            clearInterval(countdown);
            setTimeout(() => {
                document.getElementById("overlayText").style.display = "none";
                acceptPlayerInput = true;
                runGameTimer();
            }, 1200);
        }
        ct--;
    }, 1200);
}

// Run a game timer for 3 minutes after game start
var tRemaining = 180;
function runGameTimer() {
    var gameTimer = setInterval(() => {
        tRemaining--;
        let min = Math.floor(tRemaining / 60);
        let sec = (tRemaining % 60).toString().padStart(2, '0');
        document.getElementById("timer").innerText = `${min}:${sec}`;
        // Handle game end
        if (tRemaining === 0) {
            clearInterval(gameTimer);
            acceptPlayerInput = false;
            document.getElementById("gameEndSummary").style.display = "unset";
        }
    }, 1000);
}

// Use interop to set score
function updateScore(orange, blue) {
    if (instance)
        instance.invokeMethodAsync('UpdateScore', orange, blue);
}

// Trigger goal text and reset ball & players
function triggerGoal() {
    // Disable player input
    acceptPlayerInput = false;
    // Set ball position and remove momentum
    Matter.Body.setPosition(ball, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    Matter.Body.setVelocity(ball, { x: 0, y: 0 });
    // Reset players
    resetPlayers();
    // Animate goal text
    let textNode = document.getElementById("overlayText");
    textNode.innerText = "";
    textNode.style.display = "unset";
    let letters = ['G', 'O', 'A', 'A', 'L', '!'];
    for (var i = 0; i < letters.length; i++) {
        setTimeout((x) => {
            textNode.innerText += letters[x];
        }, 100 * i, i);
    }
    setTimeout(() => {
        // Hide text and reenable input
        textNode.style.display = "none";
        acceptPlayerInput = true;
    }, (100 * letters.length) + 1500);
}

// Resets players to their original positions
function resetPlayers() {
    var indexA = 1, indexB = 1;
    var teamAHeight = window.innerHeight / (tCA + 1);
    var teamBHeight = window.innerHeight / (tCB + 1);
    playerJson.forEach((player) => {
        let playerObject = playerDict[player.Id];
        Matter.Body.setVelocity(playerObject, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(playerObject, 0);
        if (player.Team == 1) {
            let xPos = (1 / 4 * window.innerWidth), yPos = (teamAHeight * indexA);
            Matter.Body.setPosition(playerObject, { x: xPos, y: yPos });
            Matter.Body.setAngle(playerObject, 3.14);
            indexA++;
        }
        else if (player.Team == 2) {
            let xPos = (3 / 4 * window.innerWidth), yPos = (teamBHeight * indexB);
            Matter.Body.setPosition(playerObject, { x: xPos, y: yPos });
            Matter.Body.setAngle(playerObject, 0);
            indexB++;
        }
    });
}

window.applyplayerforce = (playerID, xF, yF) => {
    if (!acceptPlayerInput) return;
    let playerObj = playerDict[playerID];
    Matter.Body.applyForce(playerObj, playerObj.position, { x: xF, y: yF });
}