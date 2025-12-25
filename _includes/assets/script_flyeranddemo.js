/*** DATA ***/
var gameJson = {{ site.data.demo | jsonify }},
    gameID = 0;

var vCharX = 0,
    vCharY = 0,
    vCharPos = 0;

var vCharRotation = -90; // up

var tagCodeMoveForward = document.querySelector(".js-code.for-moveForward"),
    tagCodeTurnLeft = document.querySelector(".js-code.for-turnLeft"),
    tagCodeTurnRight = document.querySelector(".js-code.for-turnRight"),
    tagSpriteCharacter = document.querySelector(".js-sprite.is-character"),
    tagNewGame = document.querySelector(".js-new");

var gridTiles = document.querySelectorAll(".demo-content-grid-box");
/*** END DATA ***/


/*** LEVEL LOADER ***/
function loadLevel(id) {
    gameID = id % gameJson.length;

    var levelKey  = Object.keys(gameJson[gameID])[0];
    var levelData = gameJson[gameID][levelKey][0];

    // RESET POSITION
    vCharX = 0;
    vCharY = 0;
    vCharPos = levelData.start[0];

    tagSpriteCharacter.setAttribute("attr-start", vCharPos);
    tagSpriteCharacter.setAttribute("attr-direction", levelData.start[1]);

    // ROTATION FROM START DIR
    if (levelData.start[1] === "up") vCharRotation = -90;
    if (levelData.start[1] === "right") vCharRotation = 0;
    if (levelData.start[1] === "down") vCharRotation = 90;
    if (levelData.start[1] === "left") vCharRotation = 180;

    // RESET GRID
    gridTiles.forEach((tile, i) => {
        const n = i + 1;
        tile.classList.remove("is-map", "has-money");

        if (levelData.map.includes(n)) {
            tile.classList.add("is-map");
        }

        if (levelData.money.includes(n)) {
            tile.classList.add("has-money");
        }
    });

    updateSprite();
}
/*** END LEVEL LOADER ***/


/*** FUNCTIONS ***/
function updateSprite() {
    tagSpriteCharacter.style.transform =
        `translate(${vCharX}%, ${vCharY}%) rotate(${vCharRotation}deg)`;

    var tile = document.querySelector(
        ".demo-content-grid-box:nth-child(" + vCharPos + ")"
    );

    if (tile && tile.classList.contains("has-money")) {
        tile.classList.remove("has-money");
    }
}

function getDirection() {
    let r = ((vCharRotation % 360) + 360) % 360;
    if (r === 0) return "right";
    if (r === 90) return "down";
    if (r === 180) return "left";
    if (r === 270) return "up";
}
/*** END FUNCTIONS ***/


/*** EVENTS ***/
tagCodeMoveForward.addEventListener("click", function () {
    let dir = getDirection();

    switch (dir) {
        case "up":
            if (vCharPos > 3) {
                vCharY -= 100;
                vCharPos -= 3;
            }
            break;
        case "down":
            if (vCharPos < 7) {
                vCharY += 100;
                vCharPos += 3;
            }
            break;
        case "left":
            if (vCharPos % 3 !== 1) {
                vCharX -= 100;
                vCharPos -= 1;
            }
            break;
        case "right":
            if (vCharPos % 3 !== 0) {
                vCharX += 100;
                vCharPos += 1;
            }
            break;
    }

    updateSprite();
});

tagCodeTurnLeft.addEventListener("click", function () {
    vCharRotation -= 90;
    updateSprite();
});

tagCodeTurnRight.addEventListener("click", function () {
    vCharRotation += 90;
    updateSprite();
});

tagNewGame.addEventListener("click", function () {
    loadLevel(gameID + 1);
});
/*** END EVENTS ***/


// INITIAL LOAD
loadLevel(0);
