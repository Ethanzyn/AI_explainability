// MAIN SKETCH FOR FINAL CELEBA SAMPLE

let cloudLocations, gridLocations;
let females, femalesTable;
let tSNEimages = [];
let tSNEmode;
let closestImage, closestDistance, winner;
let xRows = 40;
let yRows = 25;
let cWidth = 1000;
let cHeight = (cWidth/xRows)*yRows
let datasetSize = 1000
let xMarg = 5;
let yMarg = 5;
let scaleFactor;

let picScale = cWidth/xRows

let selected;
let scaleSlider;
let scaleSliderY, scaleSliderX, scaleSliderW;

let parentDiv, parentDivRect;

let tx = 0;
let ty = 0;
let prevPosition = [0,0]

let outlineColor;

function preload() {
	cloudLocations = loadJSON('assets/cloudLocations.json');
	gridLocations = loadTable('assets/gridLocations.csv');

	sourceCode = loadFont("assets/SourceCodePro-Regular.ttf")

	femalesTable = loadTable('assets/lists/femalesList')
	angryTable = loadTable('assets/lists/angryList')
	disgustTable = loadTable('assets/lists/disgustList')
	fearTable = loadTable('assets/lists/fearList')
	happyTable = loadTable('assets/lists/happyList')
	sadTable = loadTable('assets/lists/sadList')
	surpriseTable = loadTable('assets/lists/surpriseList')
	neutralTable = loadTable('assets/lists/neutralList')
}

function formatList(lst){
	for (let i = 0; i < lst.length; i++){
		lst[i] = int(lst[i][0])
	}
}

function setupTables(){
	females = femalesTable.getArray();
	angryList = angryTable.getArray();
	disgustList = disgustTable.getArray();
	fearList = fearTable.getArray();
	happyList = happyTable.getArray();
	sadList = sadTable.getArray();
	surpriseList = surpriseTable.getArray();
	neutralList = neutralTable.getArray();

	for (lst of [females, angryList, disgustList, fearList, happyList, sadList, surpriseList, neutralList]){
		formatList(lst)
	}
}

function setup() {
	console.log("This is the main file")
	var canvas = createCanvas(cWidth, cHeight);
	canvas.parent('tSNEp5');

	parentDiv = document.getElementById("tSNEp5");
	parentDivRect = tSNEp5.getBoundingClientRect()

	colorMode(HSL, 100)
	textFont(sourceCode)
	textAlign(LEFT, TOP)
	outlineColor = color(5, 98, 50)

	tSNEmode = "grid"
	selected = "gender"

	setupTables();
	getImages();

	scaleSlider = createSlider(1, 3, 1)
	scaleSliderX = cWidth/2
	scaleSliderY = 920
	scaleSliderW = cWidth/10;
	scaleSlider.position(scaleSliderX, scaleSliderY)
	scaleSlider.style('width', 'scaleSliderW')
	scaleSlider.parent('tSNEp5')

}

function getImages(){
	for (let i = 0; i < datasetSize; i++){
		let location, x, y, isFemale;

		location = cloudLocations[i]

		// get different locations depending on mode
		if (tSNEmode == "cloud") {
			x = map(float(location.point[0]), 0, 1, 0, width)
			y = map(float(location.point[1]), 0, 1, 0, height)
		}
		else if (tSNEmode == "grid") {
			let pos = (gridLocations.get(i, 0)).split(";")
			x = float(pos[0])
			y = float(pos[1])
			x = map(x, 0, xRows, 0, width)
			y = map(y, 0, yRows, 0, height)
		}
		else {
			console.log("tSNE mode not set!")
		}

	    // get path to image file and its number
	    let filename = location.path
	    let num = int(filename.slice(0, 6))
	    
	    let path = "sample/" + str(filename)
	    let img = loadImage(path)

	    let wholeImage = [x, y, num, img]

	    // is this image in the females object?
	    if (females.includes(num)){wholeImage.push(true)} else {wholeImage.push(false)};

	    // 5. happy, 6. angry, 7. disgust, 8. fear, 9. sad, 10. surprised, 11. neutral
	    if (happyList.includes(num)){wholeImage.push(true)} else {wholeImage.push(false)};
	    if (angryList.includes(num)){wholeImage.push(true)} else {wholeImage.push(false)};
	    if (disgustList.includes(num)){wholeImage.push(true)} else {wholeImage.push(false)};
	    if (fearList.includes(num)){wholeImage.push(true)} else {wholeImage.push(false)};
	    if (sadList.includes(num)){wholeImage.push(true)} else {wholeImage.push(false)};
	    if (surpriseList.includes(num)){wholeImage.push(true)} else {wholeImage.push(false)};
	    if (neutralList.includes(num)){wholeImage.push(true)} else {wholeImage.push(false)};

	    tSNEimages.push(wholeImage)
	}
}

// stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas
function distance(x1, y1, x2, y2){
	var a = x1 - x2;
	var b = y1 - y2;
	var c = Math.sqrt( a*a + b*b );
	return c;
}

function draw() {
	background(0)
	closestImage = 0
	closestDistance = 10000
	winner = []

	push();
	scaleFactor = scaleSlider.value()
	scale(scaleFactor)

	// translate(tx, ty)

	for (let i = 0; i < tSNEimages.length; i++){
		let curr = tSNEimages[i]
		let x = curr[0]
		let y = curr[1]
		let num = curr[2]
		let img = curr[3]
		let isFemale = curr[4]
		let isHappy = curr[5]
		let isAngry = curr[6]
		let isDisgust = curr[7]
		let isFear = curr[8]
		let isSad = curr[9]
		let isSurprise = curr[10]
		let isNeutral = curr[11]
		let w = picScale
		let h = w
		image(img, x, y, w, h)

	    // calculate distance from the mouse
	    let currDistance = distance((mouseX - tx)/scaleFactor, (mouseY - ty)/scaleFactor, x + w/2, y + h/2)
	    //console.log(["at i = ", i, " distance = ", currDistance])
	    if (currDistance < closestDistance){
	    	closestDistance = currDistance
	    	closestImage = num
	    }
	    if (closestImage == num){
	    	winner = curr
	    }

	    // if in females list and mode is female, draw overlay
	    noStroke();
	    noFill();
	    if (selected == "gender"){
		    if (isFemale) {
		    	fill(13, 70, 70, 70)
		    }
		}
		else if (selected == "emotion"){
			// negative emos
			if (isAngry || isDisgust || isSad) {
				fill(0, 70, 70, 70)
			}
			// happy
			else if (isHappy) {
				fill(30, 70, 70, 70)
			}
			// neutral
			else if (isNeutral) {
				fill(60, 70, 70, 70)
			}
			// other emos
			else {
				fill(80, 70, 70, 70)
			}
		}
		rect(x, y, w, h)
	}
	if (winner[2] != undefined){
		drawWinner(winner)
	}
	pop();
	drawSliderBg();
}

// draw rectangle around slider
function drawSliderBg(){
	noStroke();
	fill(100);
	rect(scaleSliderX - 50, scaleSliderY - 375, scaleSliderW*1.5, 40)
}

// draw tooltip for closest image to mouse
function drawWinner(winner){
	let x = winner[0]
	let y = winner[1]
	let num = winner[2]
	let img = winner[3]
	let w = winner[3].width/scaleFactor/1.5
	let h = winner[3].height/scaleFactor/1.5
	let isFemale = winner[4]
	let winnerXOffset = picScale
	let winnerYOffset = picScale
	let textboxY = y + h + winnerYOffset

	// outline for main (smaller) img
	noFill();
	stroke(outlineColor)
	strokeWeight(3/scaleFactor)
	rect(x, y, winnerXOffset, winnerYOffset)

	// decide which corner caption will be drawn from
	let rectHeight = h + h/3
	// bottom right
	if (x <= cWidth - w && y <= cHeight - rectHeight){
		image(img, x + winnerXOffset, y + winnerYOffset, w, h)
		drawCaption(x + winnerXOffset, y + h + winnerYOffset, w, h, num, isFemale)
	}
	// bottom left
	else if (x >= cWidth - w && y <= cHeight - rectHeight){
		image(img, x - w, y + winnerYOffset, w, h)
		drawCaption(x - w, y + h + winnerYOffset, w, h, num, isFemale)
	}
	// top right
	else if (x <= cWidth - w && y >= cHeight - rectHeight){
		image(img, x + winnerXOffset, y - rectHeight, w, h)
		drawCaption(x + winnerXOffset, y - h/3, w, h, num, isFemale)
	}
	// top left
	else if (x >= cWidth - w && y >= cHeight - rectHeight){
		image(img, x - w, y - rectHeight, w, h)
		drawCaption(x - w, y - h/3, w, h, num, isFemale)
	}

}

function drawCaption(x, y, w, h, num, isFemale){
	// white rect
	noStroke()
	fill(100)
	rect(x, y, w, h/2)
	// text
	fill(0)
	textSize(12/scaleFactor)
	text("Image #" + str(num), x + xMarg/scaleFactor, y + yMarg/scaleFactor)
	text("Female = " + str(isFemale), x + xMarg/scaleFactor, y + yMarg*5/scaleFactor);

	// colorful outline
	noFill();
	strokeWeight(3/scaleFactor)
	stroke(outlineColor)
	rect(x, y - h, w, 3*h/2) // for entire tooltip
}

// function mouseDragged(){
// 	tx = (mouseX - prevPosition[0]);
// 	ty = (mouseY - prevPosition[1]);

// 	console.log([tx, ty])
// 	prevPosition[0] = tx
// 	prevPosition[1] = ty
	
// }