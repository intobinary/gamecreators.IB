/*** DATA ***/
var tagCodeBlock = null, newTagCodeBlock = null,
	tagsCodeBlocks = document.querySelectorAll(".js-code"),
	tagCodeArea = document.querySelector(".js-codeArea");
/*** END DATA ***/

/*** EVENTS ***/
tagsCodeBlocks.forEach(codeBlock => makeDraggable(codeBlock));
tagCodeArea.addEventListener("dragover", e => {
	e.preventDefault();
});
tagCodeArea.addEventListener("drop", e => {
	e.preventDefault();
	
	if(!tagCodeBlock){ return; }

	if (tagCodeBlock.parentElement.classList.contains("js-codeArea")) { newTagCodeBlock = tagCodeBlock; }
	else {
		newTagCodeBlock = tagCodeBlock.cloneNode(true);
		makeDraggable(newTagCodeBlock);
	}
 	tagCodeArea.appendChild(newTagCodeBlock);
	
    newTagCodeBlock.style.left = (e.clientX - tagCodeArea.getBoundingClientRect().left - cursorOffsetX) + "px";
    newTagCodeBlock.style.top  = (e.clientY - tagCodeArea.getBoundingClientRect().top  - cursorOffsetY) + "px";
	
	tagCodeBlock = null, newTagCodeBlock = null;
});
/*** END EVENTS ***/

/*** FUNCTIONS ***/
	function makeDraggable(block) {
		block.draggable = true;
		
		block.addEventListener("dragstart", e => {
			tagCodeBlock = block;

			// store cursor offset inside the element
			const rect = block.getBoundingClientRect();
			cursorOffsetX = e.clientX - rect.left;
			cursorOffsetY = e.clientY - rect.top;

			e.dataTransfer.effectAllowed = "move";
			e.dataTransfer.setDragImage(block, cursorOffsetX, cursorOffsetY);
		});
	}

/*
var vCharY = 0;
var tagCodeMoveForward = document.querySelector(".js-code.for-moveForward"),
	tagSpriteCharacter = document.querySelector(".js-sprite.is-character");
tagCodeMoveForward.addEventListener("click", function() {
	switch(tagSpriteCharacter.getAttribute("attr-direction")) {
		case "up":
			vCharY -= 100;
			tagSpriteCharacter.style.transform = "translateY("+vCharY+"%) rotate(-90deg)";
			break;
		default:
	}
});
*/
/*** END FUNCTIONS ***/