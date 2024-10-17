let passage = "I leave Sisyphus at the foot of the mountain. One always finds one's burden again. But Sisyphus teaches the higher fidelity that negates the gods and raises rocks. He too concludes that all is well. This universe henceforth without a master seems to him neither sterile nor futile. Each atom of that stone, each mineral flake of that night-filled mountain, in itself, forms a world. The struggle itself toward the heights is enough to fill a man's heart. One must imagine Sisyphus happy.";
let words = passage.split(" ");
let currentIndex = 0;
let wordRotations = [];
let wordPositions = [];
let threshold = 40;
let randomThreshold;

let lastAlpha = 0;
let lastBeta = 0;
let lastGamma = 0;

let aboutVisible = false;
let aboutAlpha = 0;
let animateOffScreen = false;
let passageComplete = false;

let aboutme = 'In our modern capitalist society, an object’s worth is determined based on its efficiency, purpose, and profitability. This website has none of these things; it doesn’t even have anything to click. It’s hard to use, illegible, and was conceived at 3 AM the day that it was due. But in a world obsessed with productivity, this is my one small act of rebellion. The website itself is an anti-product. Rather than optimizing for functionality or clarity, it forces you to slow down, grapple with its eccentricities, and enjoy a little chaos along the way. Thinking outside the box (literally), it aims to throw the rulebook—and its functionality clause—right out the window. \ ——Which is what I wish I could tell you, that’s just a vaguely academic reason I tacked on post facto. The only truthful sentence in there is the third one. Originally, I had an entirely different idea that still also utilized the orientation sensors in phone browsers, but it got entirely too confusing because of screen rotations, spirals versus LTR reading directions, browser previews, and general code issues, yada yada… But with some hand holding from ChatGPT, I was able to create this website just in time for my presentation. Quite honestly, as I’m writing this, I’m not even sure if the website works on mobile because I couldn’t figure out a way to test it out on my phone without having to publish it. Anyways, I guess I could also tell you some made up story about why I chose a passage from The Myth of Sisyphus by Camus, but I’m trying to be more honest these days. It was just from my initial idea which was based on exertion and futility, but I was too tired to find a different passage. \ What this website is meant to be, though, is frustrating, useless, and absurd (wait, so maybe the Camus passage kinda makes sense). It’s the kind of website that makes you think, “well that’s just 3 minutes of my life I just wasted.” Not to mention, it’s also sort of ugly but we’ll just call the design, “simple” or “straightforward.” Better that the design deters viewers before they have to read this tangent-ridden, stream-of-consciousness “About” page.';

function setup() {
	createCanvas(windowWidth, windowHeight);
	textSize(24);
	textFont('Times New Roman');
	textAlign(LEFT, TOP);
	fill(255);
  
	for (let i = 0; i < words.length; i++) {
		wordRotations.push(null);
		wordPositions.push(createVector(50, 50)); // Starting positions
	}
  
	randomThreshold = threshold + random(-3, 3);
  
	if (window.DeviceOrientationEvent) {
		window.addEventListener("deviceorientation", handleOrientation);
	}
}

function draw() {
	background(0);
	let x = 50;
	let y = 50;
	let lineHeight = textAscent() + textDescent() + 15;
  
	for (let i = 0; i < currentIndex; i++) {
		if (animateOffScreen) {
			wordPositions[i].y -= 1; // Control speed of movement
			wordPositions[i].x = map(wordPositions[i].y, height, 0, 50, width / 2); // Movement towards center
		}

		if (x + textWidth(words[i]) > width - 50) {
			x = 50;
			y += lineHeight;
		}

		let wordPosX = animateOffScreen ? wordPositions[i].x : x;
		let wordPosY = animateOffScreen ? wordPositions[i].y : y;

		fill(255);
		noStroke();
		push();
		translate(wordPosX + textWidth(words[i]) / 2, wordPosY + lineHeight / 2);
		rotate(radians(wordRotations[i] !== null ? wordRotations[i] : 0));
		rectMode(CENTER);
		rect(0, -10, textWidth(words[i]) + 10, lineHeight - 5);
		pop();

		fill(0);
		if (wordRotations[i] !== null) {
			push();
			translate(wordPosX + textWidth(words[i]) / 2, wordPosY + lineHeight / 2);
			rotate(radians(wordRotations[i]));
			text(words[i], -textWidth(words[i]) / 2, -lineHeight / 2);
			pop();
		} else {
			text(words[i], wordPosX, wordPosY);
		}

		x += textWidth(words[i]) + 10;
	}
  
	if (currentIndex >= words.length) {
		passageComplete = true;
	}
  
	if (aboutVisible && passageComplete) {
		aboutAlpha = constrain(aboutAlpha + 5, 0, 255);
		fill(255, 255, 255, aboutAlpha);
		textAlign(LEFT, TOP);
		textSize(14.5);
		textWrap(WORD);
		text(aboutme, 50, 50, width - 100); // Wrapping with a margin
	}
}

function handleOrientation(event) {
	const alpha = event.alpha;
	const beta = event.beta;
	const gamma = event.gamma;
  
	let alphaChange = abs(alpha - lastAlpha);
	let betaChange = abs(beta - lastBeta);
	let gammaChange = abs(gamma - lastGamma);
  
	if (currentIndex < words.length && 
		(alphaChange > randomThreshold || betaChange > randomThreshold || gammaChange > randomThreshold)) {
		wordRotations[currentIndex] = gamma;
		currentIndex++;
		randomThreshold = threshold + Math.floor(random(-5, 5));
		lastAlpha = alpha;
		lastBeta = beta;
		lastGamma = gamma;
	}
  
	if (alpha === 180 && beta === -90 && gamma === 0 && passageComplete) {
		animateOffScreen = true;
		aboutVisible = true;
	}
}

function resetText() {
	currentIndex = 0;
	wordRotations = Array(words.length).fill(null);
	randomThreshold = threshold + Math.floor(random(-5, 5));
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
