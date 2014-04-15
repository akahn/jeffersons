var canvas = document.getElementById('container');
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#FF0000";

var pointSize = 3,
    quintileSize = 500;

var quintileZones = {
  1: [[0,0],   [800, 120]],
  2: [[0,120], [800, 240]],
  3: [[0,240], [800, 360]],
  4: [[0,360], [800, 480]],
  5: [[0,480], [800, 600]],
}

var quintileColors = {
  1: "silver",
  2: "gray",
  3: "#444444",
  4: "#222222",
  5: "#333333"
}

var peopleColors = {
  1: "papayawhip",
  2: "goldenrod",
  3: "indianred",
  4: "lightgreen",
  5: "dodgerblue"
}

// How likely is it for a member of a quintile (key) to move to another quintile (value)
var quintileMobility = {
  1: {1: 0,   2: 0,   3: 0,   4: .25, 5: .75},
  2: {1: 0,   2: 0,   3: .25, 4: .5,  5: .25},
  3: {1: 0,   2: .25, 3: .5,  4: .25, 5: 0},
  4: {1: .25, 2: .5,  3: .25, 4: 0,   5: 0},
  5: {1: .75, 2: .25, 3: 0,   4: 0,   5: 0}
}

var quintileMobilityRange = {
  1: {1: [0,.75], 2: [.75,1],   3: [0,0],     4: [0,0],     5: [0,0]},
  2: {1: [0,.25], 2: [.25,.75], 3: [.75,1],   4: [0,0],     5: [0,0]},
  3: {1: [0,0],   2: [0,.25],   3: [.25,.75], 4: [.75,1],   5: [0,0]},
  4: {1: [0,0],   2: [0,0],     3: [0,.25],   4: [.25,.75], 5: [.75,1]},
  5: {1: [0,0],   2: [0,0],     3: [0,0],     4: [0,.25],   5: [.25,1]}
}

function stepQuintile(person) {
  var row = quintileMobilityRange[person.quintile];
  var random = Math.random();

  for (var cell in row) {
    if (random > row[cell][0] && random < row[cell][1]) {
      person.setQuintile(cell);
      return person;
    }
  }
  throw new Error("Random value not in any of this quintile's probability ranges");
}

var Person = function(initialQuintile) {
  this.initialQuintile = initialQuintile;
  this.quintile = initialQuintile;

  this.setQuintile = function(newQuintile) {
    this.quintile = newQuintile;
  }

  this.draw = function() {
    ctx.fillStyle = peopleColors[this.initialQuintile];
    var bounds = quintileZones[this.quintile];
    var x = randomIntInRange(0, 800)
    var y =  randomIntInRange(bounds[0][1], bounds[1][1]);
    drawPoint(x, y);
  }
}

// Loop over quintile zones to draw a background color
function drawQuintileBackgrounds() {
  for (var quintile in quintileZones) {
    ctx.fillStyle = quintileColors[quintile];
    var bounds = quintileZones[quintile][0];
    ctx.fillRect(bounds[0], bounds[1], 800, 120);
  }
}

function setupInitialPopulation() {
  for (var zone in quintileZones) {
    for (i = 1; i <= quintileSize; i++) {
      var p = new Person(zone);
      people.push(p);
      p.draw();
    }
  }
}

function drawPeople(people) {
  people.forEach(function(person) {
    person.draw();
  });
}

function drawPoint(x, y) {
  ctx.fillRect(x, y, pointSize, pointSize);
}

function randomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

var people = [];

drawQuintileBackgrounds();
setupInitialPopulation();


function iterate() {
  people.forEach(function(person) {
    stepQuintile(person);
  });
  drawQuintileBackgrounds();

  people.forEach(function(person) {
    person.draw();
  });

}

document.getElementById('step').onclick = function() {
  iterate();
};
