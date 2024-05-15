let points = [];
let delaunay, voronoi;
let button;
let numPointsSlider;
let numPoints = 250;
let color1 = '#2DC5F4';
let color2 = '#F063A4';

function setup() {
  createCanvas(750, 500);
  
  noiseDetail(8, 0.5);
  generatePoints();
  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);

  // Slider for number of points
  numPointsSlider = select('#numPoints');
  numPointsSlider.input(updateNumPoints);
  
  // Color pickers
  colorPicker1 = select('#color1');
  colorPicker1.input(updateColor1);
  colorPicker2 = select('#color2');
  colorPicker2.input(updateColor2);
  
  // Button for redrawing canvas from scratch
  button = createButton('Regenerate');
  button.id('regenerateButton');
  button.mousePressed(redrawVoronoi);
}

function draw() {
  background(255);

  noLoop();
  let polygons = voronoi.cellPolygons();
  let cells = Array.from(polygons);

  for (let poly of cells) {
    stroke(50, 50, 50);
    strokeWeight(2);

    // Apply Perlin noise to the colors
    let c1 = color(color1);
    let c2 = color(color2);
    let noiseValue = noise(poly[0][0] * 0.01, poly[0][1] * 0.01);
    fill(lerpColor(c1, c2, noiseValue));

    beginShape();
    for (let i = 0; i < poly.length; i++) {
      vertex(poly[i][0], poly[i][1]);
    }
    endShape();
  }
}

function generatePoints() {
  points = [];
  for (let i = 0; i < numPoints; i++) {
    let x = random(width);
    let y = random(height);

    // Apply Perlin noise to the initial points
    let nx = x + map(noise(x * 0.01, y * 0.01), 0, 1, -50, 50);
    let ny = y + map(noise(x * 0.01 + 100, y * 0.01 + 100), 0, 1, -50, 50);

    points.push(createVector(nx, ny));
  }
}

function redrawVoronoi() {
  numPoints = numPointsSlider.value();
  generatePoints();
  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);
  redraw();
}

function calculateDelaunay(points) {
  let pointsArray = [];
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}

function updateNumPoints() {
  select('#numPointsValue').html(numPointsSlider.value());
}

function updateColor1() {
  color1 = colorPicker1.value();
  //redraw();
}

function updateColor2() {
  color2 = colorPicker2.value();
  //redraw();
}