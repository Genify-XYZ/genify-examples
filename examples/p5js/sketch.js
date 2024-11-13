let system;
let colorPalette;
let noiseScale;
let rotationSpeed;
let subdivisions;
let particleDensity;
let baseHue;  
let scheme;   

function preload() {
    let seed = ~~(genify.random() * 123456789);
    console.log(seed);
    randomSeed(seed);
    noiseSeed(seed);
}

class ParticleSystem {
    constructor() {
        this.layers = [];
        this.initializeLayers();
        this.baseRotation = genify.random() * TWO_PI;
    }

    initializeLayers() {
        for (let i = 0; i < 3; i++) {
            this.layers.push(new Layer(i));
        }
    }

    update() {
        this.baseRotation += rotationSpeed;
        this.layers.forEach(layer => layer.update(this.baseRotation));
    }

    draw() {
        this.layers.forEach(layer => layer.draw());
    }
}

class Layer {
    constructor(index) {
        this.index = index;
        this.particles = [];
        this.offset = genify.random() * TWO_PI;
        this.speed = genify.randFloat(0.5, 1.5);
        this.scale = map(index, 0, 2, 1.2, 0.8);
        
        this.gStyle = genify.choice([
            'classic',      
            'bold',       
            'slim',       
            'lowercase', 
            'geometric',  
            'rounded'    
        ]);
        
        this.generateParticles();
    }

    generateParticles() {
        let points = this.createGShape();
        points.forEach(point => {
            if (genify.random() < particleDensity) {
                this.particles.push(new Particle(point, this.index));
            }
        });
    }

    createGShape() {
        let points = [];
        let centerX = width / 2;
        let centerY = height / 2;
        let size = min(width, height) * 0.3 * this.scale;
        
        switch(this.gStyle) {
            case 'classic':
                points = this.createClassicG(centerX, centerY, size);
                break;
            case 'bold':
                points = this.createBoldG(centerX, centerY, size);
                break;
            case 'slim':
                points = this.createSlimG(centerX, centerY, size);
                break;
            case 'lowercase':
                points = this.createLowercaseG(centerX, centerY, size);
                break;
            case 'geometric':
                points = this.createGeometricG(centerX, centerY, size);
                break;
            case 'rounded':
                points = this.createRoundedG(centerX, centerY, size);
                break;
        }
        
        return points;
    }

    createClassicG(x, y, size) {
        let points = [];
        for (let i = 0; i < subdivisions; i++) {
            let t = i / subdivisions;
            let angle = map(t, 0, 1, -PI/8, TWO_PI - PI/3);
            let r = size * (1 + 0.1 * sin(angle * 3));
            points.push(createVector(
                x + cos(angle) * r,
                y + sin(angle) * r
            ));
        }
        for (let i = 0; i < 20; i++) {
            let t = i / 20;
            points.push(createVector(
                x + size * 0.2 + t * size * 0.5,
                y - size * 0.1 + sin(t * PI) * 5
            ));
        }
        return points;
    }

    createBoldG(x, y, size) {
        let points = [];
        for (let i = 0; i < subdivisions; i++) {
            let t = i / subdivisions;
            let angle = map(t, 0, 1, -PI/8, TWO_PI - PI/3);
            let r = size * (1 + 0.15 * sin(angle * 2));
            points.push(createVector(
                x + cos(angle) * r,
                y + sin(angle) * r
            ));
        }
        for (let i = 0; i < subdivisions; i++) {
            let t = i / subdivisions;
            let angle = map(t, 0, 1, -PI/8, TWO_PI - PI/3);
            let r = size * 0.9 * (1 + 0.15 * sin(angle * 2));
            points.push(createVector(
                x + cos(angle) * r,
                y + sin(angle) * r
            ));
        }
        for (let i = 0; i < 30; i++) {
            let t = i / 30;
            points.push(createVector(
                x + size * 0.2 + t * size * 0.6,
                y + sin(t * PI) * 15
            ));
        }
        return points;
    }

    createSlimG(x, y, size) {
        let points = [];
        for (let i = 0; i < subdivisions; i++) {
            let t = i / subdivisions;
            let angle = map(t, 0, 1, -PI/8, TWO_PI - PI/3);
            let r = size * (1.2 + 0.05 * sin(angle * 4));
            points.push(createVector(
                x + cos(angle) * r * 0.8,
                y + sin(angle) * r
            ));
        }
        for (let i = 0; i < 15; i++) {
            let t = i / 15;
            points.push(createVector(
                x + size * 0.1 + t * size * 0.4,
                y + sin(t * PI) * 3
            ));
        }
        return points;
    }

    createLowercaseG(x, y, size) {
        let points = [];
        for (let i = 0; i < subdivisions/2; i++) {
            let t = i / (subdivisions/2);
            let angle = map(t, 0, 1, -PI, 0);
            points.push(createVector(
                x + cos(angle) * size * 0.6,
                y - size * 0.3 + sin(angle) * size * 0.6
            ));
        }
        for (let i = 0; i < subdivisions; i++) {
            let t = i / subdivisions;
            let angle = map(t, 0, 1, 0, PI * 1.5);
            points.push(createVector(
                x + cos(angle) * size * 0.6,
                y + size * 0.3 + sin(angle) * size * 0.6
            ));
        }
        return points;
    }

    createGeometricG(x, y, size) {
        let points = [];
        let segments = [
            [-0.5, -0.8], [-0.8, -0.8], [-0.8, 0.8],
            [-0.5, 0.8], [-0.5, 0.2], [0.2, 0.2],
            [0.2, 0.8], [0.8, 0.8]
        ];
        
        segments.forEach(([px, py]) => {
            for (let i = 0; i < 10; i++) {
                points.push(createVector(
                    x + px * size + genify.randFloat(-5, 5),
                    y + py * size + genify.randFloat(-5, 5)
                ));
            }
        });
        return points;
    }

    createRoundedG(x, y, size) {
        let points = [];
        for (let i = 0; i < subdivisions; i++) {
            let t = i / subdivisions;
            let angle = map(t, 0, 1, -PI/6, TWO_PI - PI/2);
            let r = size * (1 + 0.2 * sin(angle * 2));
            points.push(createVector(
                x + cos(angle) * r,
                y + sin(angle) * r
            ));
        }
        for (let i = 0; i < 25; i++) {
            let t = i / 25;
            points.push(createVector(
                x + size * 0.2 + t * size * 0.5,
                y + sin(t * PI * 2) * 10
            ));
        }
        return points;
    }

    update(baseRotation) {
        this.particles.forEach(particle => {
            particle.update(baseRotation, this.offset, this.speed);
        });
    }


    draw() {
        this.particles.forEach(particle => {
            particle.draw();
        });
    }
}

class Particle {

    constructor(pos, layerIndex) {
        this.pos = pos.copy();
        this.origin = pos.copy();
        this.vel = createVector();
        this.acc = createVector();
        this.layerIndex = layerIndex;
        this.size = genify.randFloat(2, 6) * map(layerIndex, 0, 2, 1.2, 0.8);
        this.color = colorPalette[layerIndex % colorPalette.length];
        this.phase = genify.random() * TWO_PI;
        this.noiseOffset = genify.random() * 1000;
    }

    update(baseRotation, offset, speed) {
        let time = frameCount * 0.01 * speed;
        let noise1 = noise(
            this.origin.x * noiseScale,
            this.origin.y * noiseScale,
            time
        );
        let noise2 = noise(
            this.origin.y * noiseScale,
            time,
            this.noiseOffset
        );

        let angle = baseRotation + offset + this.phase;
        let radius = 30 * noise1;
        
        let targetX = this.origin.x + 
            cos(angle) * radius + 
            sin(time * 2 + this.phase) * 20 * noise2;
            
        let targetY = this.origin.y + 
            sin(angle) * radius + 
            cos(time * 2 + this.phase) * 20 * noise2;

        this.acc.set(targetX - this.pos.x, targetY - this.pos.y);
        this.acc.mult(0.1);
        
        this.vel.add(this.acc);
        this.vel.mult(0.95);
        this.pos.add(this.vel);
    }

    draw() {
        let alpha = map(noise(this.pos.x * 0.01, this.pos.y * 0.01, frameCount * 0.02),
            0, 1, 150, 255);
        noStroke();
        fill(hue(this.color), saturation(this.color), brightness(this.color), alpha);
        circle(this.pos.x, this.pos.y, this.size);
    }
}

function setup() {
    const size = min(windowWidth, windowHeight) ;
    createCanvas(size, size);
    colorMode(HSB, 360, 100, 100, 255);
    genify.reset();

    noiseScale = genify.randFloat(0.002, 0.004);
    rotationSpeed = genify.randFloat(0.001, 0.002);
    subdivisions = genify.randInt(100, 150);
    particleDensity = genify.randFloat(0.7, 0.9);

    baseHue = genify.randInt(0, 360);
    scheme = genify.choice(['analogous', 'triadic', 'complementary']);
    colorPalette = generateColorPalette(baseHue, scheme);

    initSystem();
}


function initSystem() {
    system = new ParticleSystem();
    background(0, 0, 15);

    genify.setFeatures({
        baseHue: baseHue.toString(),
        colorScheme: scheme,
        gStyle: system.layers[0].gStyle, 
        noiseScale: noiseScale.toString(),
        particleDensity: particleDensity.toString(),
        subdivisions: subdivisions.toString(),
        layerCount: '3',
        particleCount: system.layers.reduce((acc, layer) => 
            acc + layer.particles.length, 0).toString()
    });
}

function windowResized() {
    const size = min(windowWidth, windowHeight);
    resizeCanvas(size, size);
    genify.reset();
    initSystem();
}

function generateColorPalette(baseHue, scheme) {
    let palette = [];
    switch(scheme) {
        case 'analogous':
            palette = [
                color(baseHue, 80, 95),
                color((baseHue + 30) % 360, 85, 90),
                color((baseHue + 60) % 360, 90, 85)
            ];
            break;
        case 'triadic':
            palette = [
                color(baseHue, 85, 95),
                color((baseHue + 120) % 360, 85, 90),
                color((baseHue + 240) % 360, 85, 85)
            ];
            break;
        case 'complementary':
            palette = [
                color(baseHue, 85, 95),
                color((baseHue + 180) % 360, 85, 90),
                color((baseHue + 180) % 360, 75, 85)
            ];
            break;
    }
    return palette;
}

function draw() {
    fill(0, 0, 15, 15);
    rect(0, 0, width, height);

    system.update();
    system.draw();

    if (frameCount === 1) {
        genify.renderDone();
    }
}