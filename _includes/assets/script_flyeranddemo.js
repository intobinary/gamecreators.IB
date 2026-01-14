/*** DATA ***/
var gameJson = {{ site.data.demo | jsonify }},
    gameID = 0;

var vCharX = 0,
    vCharY = 0,
    vCharPos = 0;

var vCharRotation = -90; // up

const GRID_COLS = 8;
const GRID_ROWS = 4;
const GRID_SIZE = GRID_COLS * GRID_ROWS; // 32

var newCodeBlock = null;
var aCodingArea = [], aCorrectCodingArea = [];
var tagCodingArea = document.querySelector(".js-codingArea"),
	tagCodeDelete = document.querySelector(".js-code.for-delete"),
	tagCodeMoveForward = document.querySelector(".js-code.for-moveForward"),
	tagCodePlay = document.querySelector(".js-code.for-play"),
    tagCodeTurnLeft = document.querySelector(".js-code.for-turnLeft"),
    tagCodeTurnRight = document.querySelector(".js-code.for-turnRight"),
    tagSpriteCharacter = document.querySelector(".js-sprite.is-character"),
    tagNewGame = document.querySelector(".js-new");
var gridTiles = document.querySelectorAll(".demo-content-grid-box");
/*** END DATA ***/

/*** LEVEL LOADER ***/
function loadLevel(id) {
    gameID = id % gameJson.length;

    var iLevel  = Object.keys(gameJson[gameID])[0];
    var iLevelData = gameJson[gameID][iLevel];
	var iStart = iLevelData.find(o => o.start).start;

    // RESET POSITION
    vCharX = 0;
    vCharY = 0;
    vCharPos = iStart[0];

    tagSpriteCharacter.setAttribute("attr-start", vCharPos);
    tagSpriteCharacter.setAttribute("attr-direction", iLevelData.start[1]);

    // ROTATION FROM START DIR
    if (iLevelData.start[1] === "up") vCharRotation = -90;
    if (iLevelData.start[1] === "right") vCharRotation = 0;
    if (iLevelData.start[1] === "down") vCharRotation = 90;
    if (iLevelData.start[1] === "left") vCharRotation = 180;

    // RESET GRID
    gridTiles.forEach((tile, i) => {
        const n = i + 1;
        tile.classList.remove("is-map", "has-money", "has-computers", "has-degrees", "has-books");

        if (iLevelData.map.includes(n)) { tile.classList.add("is-map"); }
        if (iLevelData.money.includes(n)) { tile.classList.add("has-money"); }
        if (iLevelData.computers.includes(n)) { tile.classList.add("has-computers"); }
        if (iLevelData.degrees.includes(n)) { tile.classList.add("has-degrees"); }
        if (iLevelData.books.includes(n)) { tile.classList.add("has-books"); }
    });

	updateSprite();
}
/*** END LEVEL LOADER ***/

/*** FUNCTIONS ***/
function doCodingStep(iStep) {
	if (iStep >= aCodingArea.length) return;

	switch (aCodingArea[iStep]) {
		case "up":
			doMoveForward();
			break;

		case "right":
			vCharRotation += 90;
			break;

		case "left":
			vCharRotation -= 90;
			break;
	}

	updateSprite();

	setTimeout(function () {
		doCodingStep(iStep + 1);
	}, 1000);
}

function doMoveForward() {
    let dir = getDirection();

	switch (dir) {
		case "up":
			if (vCharPos > GRID_COLS) {
				vCharY -= 100;
				vCharPos -= GRID_COLS;
			}
			break;

		case "down":
			if (vCharPos <= GRID_SIZE - GRID_COLS) {
				vCharY += 100;
				vCharPos += GRID_COLS;
			}
			break;

		case "left":
			if ((vCharPos - 1) % GRID_COLS !== 0) {
				vCharX -= 100;
				vCharPos -= 1;
			}
			break;

		case "right":
			if (vCharPos % GRID_COLS !== 0) {
				vCharX += 100;
				vCharPos += 1;
			}
			break;
	}
}

function updateSprite() {
    tagSpriteCharacter.style.transform =
        `translate(${vCharX}%, ${vCharY}%) rotate(${vCharRotation}deg)`;

    var tile = document.querySelector(
        ".demo-content-grid-box:nth-child(" + vCharPos + ")"
    );

    if (tile && tile.classList.contains("has-money")) { tile.classList.remove("has-money"); }
    if (tile && tile.classList.contains("has-computers")) { tile.classList.remove("has-computers"); }
    if (tile && tile.classList.contains("has-degrees")) { tile.classList.remove("has-degrees"); }
    if (tile && tile.classList.contains("has-books")) { tile.classList.remove("has-books"); }
}

function getDirection() {
    let r = ((vCharRotation % 360) + 360) % 360;
    if (r === 0) return "right";
    if (r === 90) return "down";
    if (r === 180) return "left";
    if (r === 270) return "up";
}

function addCode(theTag) {
	newTagCodeBlock = theTag.cloneNode(true);
	tagCodingArea.appendChild(newTagCodeBlock);
}
/*** END FUNCTIONS ***/


/*** EVENTS ***/
tagCodeDelete.addEventListener("click", function() {
	if(aCodingArea.length > 0) {
		aCodingArea.pop();
		var tagsCodeBlocks = document.querySelectorAll(".js-codingArea img");
		tagsCodeBlocks[tagsCodeBlocks.length - 1].remove();
	}
});

tagCodeMoveForward.addEventListener("click", function () {
	aCodingArea.push("up");
	addCode(tagCodeMoveForward);
});

tagCodePlay.addEventListener("click", function(){
	if(aCodingArea.length > 0) { doCodingStep(0); }
});

tagCodeTurnLeft.addEventListener("click", function () {
	aCodingArea.push("left");
	addCode(tagCodeTurnLeft);
});

tagCodeTurnRight.addEventListener("click", function () {
	aCodingArea.push("right");
	addCode(tagCodeTurnRight);
});

tagNewGame.addEventListener("click", function () {
    loadLevel(gameID + 1);
});
/*** END EVENTS ***/


// INITIAL LOAD
loadLevel(0);
