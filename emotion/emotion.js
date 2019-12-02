var selectedEmotion = 0 ; 
var selectedColor; 
var fetchColor; 
var img; 
var mask;
var grid;


//d3.js 
var margin = {top: 0, right: 0, bottom: 0, left: 0},
  width = 400 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// read json data 
d3.json("data1.json", function(data) {
  // Give the data to this cluster layout:
  var root = d3.hierarchy(data).sum(function(d){ return d.value})
  
  // Here the size of each leave is given in the 'value' field in input data
  // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap()
    .size([width, height])
    .padding(0)
    (root)

  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .style("stroke", "white")
      .style("fill", function(d) {
        return d.data.color})
      .on("mouseover", function(d) {
          d3.selectAll('rect').style("opacity",0.5)
          d3.select(this).style("opacity",1)
          d3.select(this).style("stroke-width",3)
          selectedEmotion = d.data.name 
          selectedColor = d.data.color
      })
      .on("mouseout", function(d) {
        d3.selectAll('rect').style("opacity",1)
        d3.selectAll('rect').style("stroke-width",1)
    })
  

  // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return (d.x0+d.x1)/2}) 
      .attr("y", function(d){ return (d.y0+d.y1)/2 })    // +20 to adjust position (lower)
      .attr('font-family','Source Code Pro')
      .style('font-weight','600')
      .text(function(d){ return d.data.name })
      .attr("font-size", function(d) { return findFontSize(d.data.value);} )
      .attr("fill", "white")
      .attr("text-anchor", "middle")

    svg
    .selectAll("vals")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr('font-family','Source Code Pro')
      .attr("text-anchor", "middle")
      .attr("x", function(d){ return (d.x0+d.x1)/2})    // +10 to adjust position (more right)
      .attr("y", function(d){ return (d.y0+d.y1)/2 + Number(findFontSize(d.data.value))/1.2})    // +20 to adjust position (lower)
      .text(function(d){ return "Weight:"+ d.data.value })
      .attr("font-size", function(d) { return subtext(d.data.value);})
      .attr("fill", "white")

  
  function findFontSize(value){
    if(value < 0.1) {
      return "14"
    } else {
      var fs; 
      fs = 12 + Math.round(value*90)
      return String(fs)
    }
  }

  function subtext(value){
    if(value < 0.05) {
      return "0"
    } else {
      var fs; 
      fs = 10 + Math.round(value*20)
      return String(fs)
    }
  }


})

//p5.js 


var exampleGrid = []
var gridSize = 24

function createExample(){
  var noiseV = 0
  var noiseV2 =0 

  for(let i=0; i < gridSize; i++){
    exampleGrid.push([])
    for(let j=0; j < gridSize; j++){
      noiseDetail(2,0.6)
      noiseV += 0.2 
      noiseV2 += 0.1
      
      let n = round(noise(noiseV,noiseV2)) 
      exampleGrid[i].push(n)
    }

  }

}

function preload(){
  getMask("038393")
  selectedEmotion = 0;
}


function setup (){
  var canvas = createCanvas(450, 450);
  canvas.parent('my_image');
  background(255);
  img = loadImage("../Dataset/img_align_celeba/000108.jpg")
  createExample();
  selectedEmotion = 0;
  
}

function getMask(imgName){
  var jn ="../lime_masks/" + imgName + ".json"
  mask = loadJSON(jn)
}
  


function drawBorder(){
  fetchColor = color(selectedColor)
  stroke(fetchColor);
  noFill();
  strokeWeight(10);
  rect(0,0,450,450);

  fill(fetchColor)
  var w = 40 + selectedEmotion.length * 7
  rect(0,0,w,36);
  fill(255);
  textSize(20);
  text(selectedEmotion, 12,25)


}

function draw(){
  background(0)

  image(img,0,0,450,450)
  if((selectedEmotion !== 0) && (selectedEmotion !== undefined) ){
    print(selectedEmotion)
    drawBorder();
    emotion = String(selectedEmotion)
    grid = mask[emotion]
    drawGrid(fetchColor)
  }

  


}

function drawGrid(color){
  var c = color;
  c.setAlpha(150)
  for(let i=0; i < gridSize; i++){
    for(let j=0; j < gridSize; j++){
      var n = grid[i][j]
      if(n == 1){
        fill(c);
        noStroke();
        var s = width/gridSize
        var y = i*s 
        var x = j*s
        rect(x,y,s,s)
      }
    }
  }
  
  
  


}






