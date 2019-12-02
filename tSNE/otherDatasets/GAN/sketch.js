let cloudLocations, gridLocations;
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

let picScale = cWidth/xRows

let femaleNums = [1, 4, 345, 688, 29, 234, 889, 657, 104, 10, 40, 245, 678, 39, 244, 829, 757, 114];
let selected;
let okToDrawWinner = false;

function preload() {
	cloudLocations = loadJSON('assets/cloudLocationsForGAN.json');
	gridLocations = loadTable('assets/gridLocationsForGAN.csv');
	sourceCode = loadFont("assets/SourceCodePro-Regular.ttf")
}

function setup() {
	var canvas = createCanvas(cWidth, cHeight);
	canvas.parent('tSNEp5');

	colorMode(HSL, 100)
	textFont(sourceCode)
	textAlign(LEFT, TOP)

	tSNEmode = "grid"
	selected = "female"

	getImages();
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
			// no idea why but this CSV is weird af
			// this is basically the only part that's different for GAN images
			let evilCSV = (gridLocations.get(i, 0)).split(";")
			x = evilCSV[0]
			y = evilCSV[1]
			x = map(x, 0, xRows, 0, width)
			y = map(y, 0, yRows, 0, height)
		}
		else {
			console.log("tSNE mode not set!")
		}

	    // get path to image file and its number
	    let filename = location.path
	    let num = int(filename.slice(0, 6))
	    
	    let path = "sampleGAN/" + str(filename)
	    let img = loadImage(path)

	    // is this image on the females list?
	    if (femaleNums.includes(num)){
	      	isFemale = true;
	    }
	    else{
	    	isFemale = false;
	    }

	    tSNEimages.push([x, y, num, img, isFemale])
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

	for (let i = 0; i < tSNEimages.length; i++){
		let curr = tSNEimages[i]
		//console.log("curr = " + str(curr))
		let x = curr[0]
		let y = curr[1]
		let num = curr[2]
		let img = curr[3]
		let isFemale = curr[4]
		let w = picScale
		let h = w
		image(img, x, y, w, h)

	    // calculate distance from the mouse
	    let currDistance = distance(mouseX, mouseY, x + w/2, y + h/2)
	    //console.log(["at i = ", i, " distance = ", currDistance])
	    if (currDistance < closestDistance){
	    	closestDistance = currDistance
	    	closestImage = num
	    }
	    if (closestImage == num){
	    	winner = curr
	    }

	    // if in females list and mode is female, draw overlay
	    if (isFemale && selected == "female") {
	    	noStroke();
	    	fill(13, 70, 70, 80)
	    	rect(x, y, w, h)
	    }
	}
	drawWinner(winner)
}

// draw tooltip for closest image to mouse
function drawWinner(winner){
	let x = winner[0]
	let y = winner[1]
	let num = winner[2]
	let img = winner[3]
	let w = winner[3].width/2
	let h = winner[3].height/2
	let isFemale = winner[4]
	let winnerXOffset = picScale
	let winnerYOffset = picScale
	let textboxY = y + h + winnerYOffset

	noFill();
	stroke(5, 98, 50)
	strokeWeight(3)
	rect(x, y, winnerXOffset, winnerYOffset) // for main (smaller) img

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
	noStroke()
	fill(100)
	rect(x, y, w, h/3)
	fill(0)
	text("Image #" + str(num), x + xMarg, y + yMarg)
	text("Female = " + str(isFemale), x + xMarg, y + yMarg*5);

	// colorful outline
	noFill();
	stroke(5, 98, 50)
	strokeWeight(3)
	rect(x, y - h, w, 4*h/3) // for entire tooltip
}