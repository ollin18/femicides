let polys = [];
let data;
let countries = [];
let cities;
let numCities = 20;
let t = 0;
let centers = [];

let scl = 30;
let xvec, yvec;
let noiseInc = 0.1;
let time = 0;
let particles = [];
let numParticles = 100;
let flowfield;
let timeSteps = 500;

let worldLayer;

let dataReady = false;

function preload() {}

function getRandomSubarray(arr, size) {
    let shuffled = arr.slice(0),
        i = arr.length,
        temp,
        index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

function setup() {
    frameRate(30);
    createCanvas(180 * 2 * 2.5, 90 * 2 * 2.5);
    worldLayer = createGraphics(width, height);

    data = loadJSON('mexico.json', () => {
        states = Object.keys(data);

        for (let state of states) {
            poly = data[state];
            let new_coords = poly.map(coords => {
                let [lng, lat] = coords;
                // not mapping 0 | width height | 0 in order to properly center the world
                return [map(lng, -180, 180, -100, width), map(lat, -90, 90, height + 100, 0)];
            });
            polys.push([state, new_coords]);
            let center = new_coords.reduce(
                (acc, curr) => {
                    let [acc_x, acc_y] = acc;
                    let [x, y] = curr;
                    return [acc_x + x, acc_y + y];
                },
                [0, 0]
            );
            center = createVector(center[0] / new_coords.length, center[1] / new_coords.length);
            centers.push(center);
        }
        cities = getRandomSubarray(centers, numCities);

        // Generate background map
        worldLayer.clear();
        worldLayer.stroke(255, 80);
        worldLayer.strokeWeight(0.5);
        worldLayer.fill(70);
        for (let el of polys) {
            let [_, poly] = el;
            worldLayer.beginShape();
            for (let coord of poly) {
                let [x, y] = coord;
                worldLayer.vertex(x, y);
            }
            worldLayer.endShape(CLOSE);
        }
        dataReady = true;
        
    });

    // FlowField();
}


function draw() {
    if (dataReady) {
        clear();
        image(worldLayer, 0, 0);

        fill(216,17,89);
        noStroke();
    }
}
