var img;
var frame;
var state;
var frameC;
var hex;
var gridSize;
var grid =[]; 
var humanPrediction; 
var commonP;
var commonColor;
var buttonState;
var mlPrediction = "false"
var mask;
var genderMask;
var MLgrid = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
,[0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]


function setup(){
    gridSize = 24;
    buttonState = 0;
    common = 0; 
    var canvas = createCanvas(400, 400);
    canvas.parent('p5js');
    background(255,255,255,100);
    img = loadImage("Dataset/img_align_celeba/034092.jpg")
    for(let i=0; i < gridSize; i++){
        grid.push([])
        for(let j=0; j < gridSize; j++){
         grid[i].push(0)
        }
      }
    var num = "034092";
    
    getMask(num)
    //MLgrid = mask["woman"]


    //   console.log(random_pic())
    
  }

function getMask(imgName){
    var jn ="lime_masks/" + imgName + ".json"
    mask = loadJSON(jn)
}













function draw(){
    image(img,0,0,400,400)
    let c2 = color(238,67,21,140)
   
    if(state == undefined){
        if(frame){
            if(frame == "woman"){
                var c = color ('#3BA4D6')
                humanPrediction = "false"
            } else {
                var c = color('#F5A623')
                humanPrediction = "true"
            }
        drawFrame(c,frame)
        } 
    } else if (state == "draw"){
        var blockC = color(hex)
        blockC.setAlpha(140)
        drawFrame(frameC,frame)
        for(let i=0; i < gridSize; i++){
            for(let j=0; j < gridSize; j++){
                var n = grid[i][j]
                if(n === 1){

                    fill(blockC)
                    noStroke();
                    var s = width/gridSize
                    var y = i*s 
                    var x = j*s
                    rect(x,y,s,s)
                  }
            }
          }
    } else if (state == "compare") {
        MLgrid = mask["man"]
        var blockC = color(hex)
        blockC.setAlpha(140)
      
        var common = 0; 
        var human = 0;
        var ML = 0; 
        




        for(let i=0; i < gridSize; i++){
            for(let j=0; j < gridSize; j++){
                var n = grid[i][j]
                var m = MLgrid[i][j]
                var s = width/gridSize
                var y = i*s 
                var x = j*s
                noStroke();
                if(n == 1){
                    human ++ 
                    fill(blockC);
                    rect(x,y,s,s)
                    if(n==m){
                        common++ 
                        blendMode(DIFFERENCE)
                    }
                  } 
                if(m == 1){
                    ML ++ 
                    fill(c2);
                    rect(x,y,s,s)   
                }
                blendMode(BLEND)
            }
          }
        drawFrame(frameC,frame)
        noStroke();
        
        if(humanPrediction == mlPrediction){
            commonColor = "#BD53AF"
        } else {
        }

        var percent = document.getElementById("percent")
        if (percent!= null){
            percent.style.color = commonColor
            

        }
 
          commonP = common*2/ (human + ML)
          print(human,ML,common,commonP)
          fill(238,67,21)
          rect(100,5,100,40); 
          fill(255);
          if(mlPrediction == "false"){
              text("woman",150,30)
          } else {
              text("man",150,30)
          }

    }

}




function changeButton(x1,x2,y1,y2){
    if(buttonState  == 0 ){
        var buttonSection = document.getElementById("buttonSection");
        buttonSection.removeChild(buttonSection.childNodes[1])
        buttonSection.removeChild(buttonSection.childNodes[2])
        addElement("buttonSection","div","button",x1,x2)
        addElement("buttonSection","div","button",y1,y2)
        buttonState = 1
    } else if(buttonState == 2 ){
        var buttonSection = document.getElementById("buttonSection");
        while (buttonSection.firstChild) {
            buttonSection.removeChild(buttonSection.firstChild);
          }
        addElement("buttonSection","div","button",x1,x2)
        document.getElementById("compare").style.width = "380px"
        document.getElementById("compare").onclick = function(){
            var tag1 = "<span id ='percent'>"
            var tag2 = "</span>"
            var str = ['Base on reference area, you "think" ' + tag1+String(round(commonP*100))+"% "+tag2+"like this AI"]
            typestuff(commonP,str)
           
        }
        
    }

}

function addElement(parentId, elementTag, elementClass, html,id) {
    // Adds an element to the document
    var p = document.getElementById(parentId);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('class', elementClass);
    newElement.setAttribute("id",id);
    newElement.setAttribute("onclick","changeGrid()") 
    newElement.onclick = function(){changeGrid(this.id)}
    var h5 =  document.createElement('h5');
    h5.innerHTML = html;
    newElement.appendChild(h5);
    p.appendChild(newElement);
}


function changeGrid(id){
    if(id == "reset") {
        for(let i=0; i < gridSize; i++){
            for(let j=0; j < gridSize; j++){
                grid[i][j] = 0 
            }
          }
    } else if(id == "done"){
        state = "compare"
        buttonState = 2 
  
        changeButton("Compare with AI","compare")

    }
}



function mouseDragged(){
    print(state)

    if(state == "draw"){
        changeButton("Reset","reset","Done","done");
        for(let i=0; i < gridSize; i++){
            for(let j=0; j < gridSize; j++){
                var s = width/gridSize
                var y = i*s 
                var x = j*s
                if ((j*s < mouseX) && (mouseX < s*(j+1)) && (i*s < mouseY) && (mouseY < s*(i+1))){
                    grid[i][j] = 1;
                }
    
            }
        }

    }
   
}
    

function typestuff(t,string){

    var tag1 = "<span class =" +t + ">"  
    var tag2 = "</span>"

    document.getElementById("typed2").innerHTML = ""
    
    if(string != undefined ){
        var typing= string
    } else {
        var typing = ['Hopefully that’s not hard.So,what makes you think this is a ' +tag1+t+tag2+"?"]
    }

    var options = {
        strings: typing,
        typeSpeed: 20,
        backSpeed: 30,
        loop: false,
        }
    var typed2 = new Typed("#typed2", options);
}

function drawFrame(c,t) {
    noFill();
    stroke(c);
    strokeWeight(10);
    rect(0,0,400,400)
    fill(c)
    rect(0,0,100,40)
    fill(255);
    textAlign(CENTER);
    textSize(24)
    
    text(t,50,30)

}

function buttonHover(x,y){
    if(state == undefined){
        if(x == 'woman'){
            frame = "woman"
            y.style.backgroundColor = "#3BA4D6"
        } else {
            frame = 'man'
            y.style.backgroundColor = "#F5A623"
        }
    }



}

function buttonNormal(x){
    if(state == undefined){
        frame = null;
        x.style.backgroundColor = 'transparent';

    }

}

function selection(x,y){

    var all = document.getElementsByClassName("button");
    for (var i = 0; i < all.length; i++) {
        all[i].style.backgroundColor = 'transparent';

      }
    y.style.borderWidth = "2px"
    state = "draw"
    frame = x
    if(x == 'woman'){
        frameC = color("#3BA4D6")
        hex ="#3BA4D6" 
        y.style.backgroundColor = "#3BA4D6"
    } else {
        frameC = color('#F5A623')
        hex ="#F5A623" 
        y.style.backgroundColor = "#F5A623"
    }

    typestuff(x)



}







 