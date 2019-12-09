// MAIN SKETCH FOR FINAL CELEuttA SAMPLE
let locations;
let females, femalesTable;
let tSNEimages = [];
var tSNEmode;
let closestImage, closestDistance, winner;
let xRows = 40;
let yRows = 25;
let cWidth = 1000;
let cHeight = (cWidth/xRows)*yRows
let datasetSize = 1000
let xMarg = 5;
let yMarg = 5;
let scaleFactor;
var showOverlays
let picScale = cWidth/xRows
let selected;
let scaleSlider;
let scaleSliderY, scaleSliderX, scaleSliderW;
let outlineColor, femaleColor;
let angryColor, happyColor, sadColor, fearColor, surpriseColor, neutralColor, disgustColor;
let overlayAlpha = 65;
let emotionAdjectiveDict = {"angry" : "angry", "happy" : "happy", "surprise" : "surprised",
							"neutral" : "neutral", "disgust" : "disgusted", "fear" : "fearful",
							"sad" : "sad"}


// p5.js initial functions 
function preload() {
	locations = loadJSON("assets/allDataFinal.json")
	sourceCode = loadFont("assets/SourceCodePro-Regular.ttf")
}

function setup() {
	console.log("This is the main file")
	var canvas = createCanvas(cWidth, cHeight);
	canvas.parent('tSNEp5');

	colorMode(HSL, 100)
	textFont(sourceCode)
	textAlign(LEFT, TOP)
	outlineColor = color(5, 98, 50);
	femaleColor = color(13, 70, 70, overlayAlpha);
	angryColor = color(0, 70, 70, overlayAlpha);
	disgustColor = color(40, 70, 70, overlayAlpha);
	happyColor = color(13, 70, 70, overlayAlpha);
	sadColor = color(50, 70, 70, overlayAlpha);
	neutralColor = color(70, 70, 70, overlayAlpha);
	fearColor = color(20, 70, 70, overlayAlpha);
	surpriseColor = color(90, 70, 70, overlayAlpha)

	tSNEmode = "grid"
	getImages();

	/// BUTTON VALUES ///
	selected = "emotion"
	showOverlays = false
	// makeDOMelements()
	///////////////////////

}

// previous scale function(keep in case still need to the scaler feature)
// function makeDOMelements(){
// 	// slider
// 	scaleSlider = createSlider(1, 5, 1)
// 	scaleSliderX = 500;
// 	scaleSliderY = cHeight;
// 	scaleSliderW = cWidth/20;
// 	scaleSlider.position(scaleSliderX, scaleSliderY)
// 	scaleSlider.style('width', 'scaleSliderW')
// 	scaleSlider.parent('tSNEp5')
// 	// mode choice
// }


// get all the images 
function getImages(){
	let keys = [];
   	for(let k in locations) keys.push(k);

	for (let i = 0; i < datasetSize; i++){
		let location, x, y, isFemale;

		location = locations[keys[i]]

		// get different locations depending on mode
		if (tSNEmode == "cloud") {
			xEmotion = map(location.cloudPointEmotion[0], 0, 1, 0, width)
			yEmotion = map(location.cloudPointEmotion[1], 0, 1, 0, height)
			xGender = map(location.cloudPointGender[0], 0, 1, 0, width)
			yGender = map(location.cloudPointGender[1], 0, 1, 0, height)
		}
		else if (tSNEmode == "grid") {
			xEmotion = map(location.gridPointEmotion[0], 0, xRows, 0, width)
			yEmotion = map(location.gridPointEmotion[1], 0, yRows, 0, height)
			xGender = map(location.gridPointGender[0], 0, xRows, 0, width)
			yGender = map(location.gridPointGender[1], 0, yRows, 0, height)
		}

	    // get path to image file and its number
	    let filename = location.path
	    let num = int(filename.slice(0, 6))
	    
	    let path = "sample/" + str(filename)
	    let img = loadImage(path)

	    let gender = location.gender
	    let emotion = location.emotion

	    let wholeImage = [xEmotion, yEmotion, xGender, yGender, num, img, gender, emotion]

	    tSNEimages.push(wholeImage);
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
	// scaleFactor = scaleSlider.value()
	// scale(scaleFactor)

	for (let i = 0; i < tSNEimages.length; i++){
		let curr = tSNEimages[i]
		let x = (selected == "emotion") ? curr[0] : curr[2]
		let y = (selected == "emotion") ? curr[1] : curr[3]
		let num = curr[4]
		let img = curr[5]
		let gender = curr[6]
		let emotion = curr[7]
		let w = picScale
		let h = w
		image(img, x, y, w, h)

		// calculate distance from the mouse
		if((mouseX<width) && (mouseX>0) && (mouseY<height) && (mouseX > 0)){
			let currDistance = distance(mouseX/scaleFactor, mouseY/scaleFactor, x + w/2, y + h/2)
	    //console.log(["at i = ", i, " distance = ", currDistance])
	    if (currDistance < closestDistance){
	    	closestDistance = currDistance
	    	closestImage = num
	    }
	    if (closestImage == num){
	    	winner = curr
	    }


		} 

	    // overlays
	    if (showOverlays){
	    	drawOverlay(x, y, w, h, gender, emotion)
		}
	}

	// draw tooltip
	if (winner[2] != undefined){
		drawWinner(winner)
	}
	pop();
	//drawSliderBg();
}

// draw overlays
function drawOverlay(x, y, w, h, gender, emotion){
    noStroke();
    noFill();
    if (selected == "gender"){

	    if (gender == "woman") {
	    	fill(femaleColor)
	    }

	}
	else if (selected == "emotion"){

		switch(emotion){
			case "happy":
				fill(happyColor)
				break
			case "sad":
				fill(sadColor)
				break
			case "angry":
				fill(angryColor)
				break
			case "neutral":
				fill(neutralColor)
				break
			case "disgust":
				fill(disgustColor)
				break
			case "surprise":
				fill(surpriseColor)
				break
			case "fear":
				fill(fearColor)
				break
		}
	}
	rect(x, y, w, h)
}

// draw rectangle around slider
function drawSliderBg(){
	let x = scaleSliderX - 50
	let y = scaleSliderY - 400
	let w = scaleSliderW*1.5
	noStroke();
	fill(100);
	rect(x, y, w, 60)
	fill(0);
	textAlign(CENTER, TOP)
	text("zoom", x + w/2, y + yMarg)
}

// draw tooltip for closest image to mouse
function drawWinner(winner){
	let x = (selected == "emotion") ? winner[0] : winner[2]
	let y = (selected == "emotion") ? winner[1] : winner[3]
	let num = winner[4]
	let img = winner[5]
	let w = winner[5].width/scaleFactor/1.2
	let h = winner[5].height/scaleFactor/1.2
	let gender = winner[6]
	let emotion = winner[7]
	let winnerXOffset = picScale
	let winnerYOffset = picScale
	let textboxY = y + h + winnerYOffset

	// outline for main (smaller) img
	noFill();
	stroke(outlineColor)
	strokeWeight(3/scaleFactor)
	rect(x, y, winnerXOffset, winnerYOffset)

	// decide which corner caption will be drawn from
	let rectHeight = h + h/2
	// bottom right
	if (x + winnerXOffset <= cWidth - w && y <= cHeight - rectHeight - winnerYOffset){
		image(img, x + winnerXOffset, y + winnerYOffset, w, h)
		drawCaption(x + winnerXOffset, y + h + winnerYOffset, w, h, num, gender, emotion)
	}
	// bottom left
	else if (x + winnerXOffset >= cWidth - w && y <= cHeight - rectHeight - winnerYOffset){
		image(img, x - w, y + winnerYOffset, w, h)
		drawCaption(x - w, y + h + winnerYOffset, w, h, num, gender, emotion)
	}
	// top right
	else if (x <= cWidth - w && y >= cHeight - rectHeight - winnerYOffset){
		image(img, x + winnerXOffset, y - rectHeight, w, h)
		drawCaption(x + winnerXOffset, y - h/2, w, h, num, gender, emotion)
	}
	// top left
	else if (x >= cWidth - w && y >= cHeight - rectHeight - winnerYOffset){
		image(img, x - w, y - rectHeight, w, h)
		drawCaption(x - w, y - h/2, w, h, num, gender, emotion)
	}

}

// draw caption for images 
function drawCaption(x, y, w, h, num, gender, emotion){
	textAlign(LEFT, TOP)
	// white rect
	noStroke()
	fill(100)
	rect(x, y, w, h/2)
	// text
	fill(0)
	textSize(12/scaleFactor)
	let textX =  x + xMarg * 2 /scaleFactor;
	let textYOffset = yMarg * 2 /scaleFactor;
	text("Image #" + str(num), textX, y + textYOffset);
	let article = (emotion == "angry") ? "an" : "a"
	let string = "AI thinks this is\n" + article + " " + emotionAdjectiveDict[emotion] 
				 + " " + gender + "."
	text(string, textX, y + textYOffset * 3)

	// colorful outline
	noFill();
	strokeWeight(3/scaleFactor)
	stroke(outlineColor)
	rect(x, y - h, w, 3*h/2) // for entire tooltip
}

// switch modes from emotion to gender or vice versa

function switchMode(value){
	print("1")

	if(value == "emotion"){
		selected = "emotion" 
	} else if(value == "gender"){
		selected = "gender"
	} else if (value == "true"){
		showOverlays = true 
	} else (
		showOverlays = false 
	)


}

// responsive control 
function mediaResponsive(x,y) {
	if (x.matches) { // If media query matches
		cWidth = 700 
	} else {
		cwidth = 1000
	}

	if(y.matches) {
		alert("this visualization is suggested to view at a wider screen size")
	}
  }
  
  var x = window.matchMedia("(max-width: 768px)")
  var y = window.matchMedia("(max-width:680px)")
  mediaResponsive(x,y) // Call listener function at run time
  x.addListener(mediaResponsive) // Attach listener function on state changes