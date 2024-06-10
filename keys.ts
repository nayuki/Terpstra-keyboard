var volume: number = 1.4;
window.addEventListener("keydown", e => {
	e.preventDefault();
	if (e.code === "ArrowDown") {//ctrl
		if (volume >= 0.1) {
			volume = +(volume - 0.1).toFixed(2);
			console.log(volume);
		}
	} else if (e.code === "ArrowUp") {
		e.preventDefault();
		if (volume <= 2.9) {
			volume = +(volume + 0.1).toFixed(2);
			console.log(volume);
		}
	}
});


class Point {
	public constructor(
		public x: number,
		public y: number) {}
	
	public equals(p: Point): boolean {
		return this.x == p.x && this.y == p.y;
	}
	
	public plus(p: Point): Point {
		var x: number = this.x + p.x;
		var y: number = this.y + p.y;
		return new Point(x, y);
	}
	
	public minus(p: Point): Point {
		var x: number = this.x - p.x;
		var y: number = this.y - p.y;
		return new Point(x, y);
	}
}


const keyCodeToCoords_mac: {[index:string]: Point} = {
	27: new Point(-5, -3), // esc
	112: new Point(-4, -3), // f1
	113: new Point(-3, -3), // f2
	114: new Point(-2, -3), // f3
	115: new Point(-1, -3), // f4
	116: new Point(0, -3), // f5
	117: new Point(1, -3), // f6
	118: new Point(2, -3), // f7
	119: new Point(3, -3), // f8
	120: new Point(4, -3), // f9
	121: new Point(5, -3), // f10
	122: new Point(6, -3), // f11
	123: new Point(7, -3), // f12
	
	
	//192: new Point(-6, -2), // `
	49: new Point(-5, -2), // 1
	50: new Point(-4, -2), // 2
	51: new Point(-3, -2), // 3
	52: new Point(-2, -2), // 4
	53: new Point(-1, -2), // 5
	54: new Point(0, -2), // 6
	55: new Point(1, -2), // 7
	56: new Point(2, -2), // 8
	57: new Point(3, -2), // 9
	48: new Point(4, -2), // 0
	189: new Point(5, -2), // -
	187: new Point(6, -2), // =
	8: new Point(7, -2), // backspace
	
	9: new Point(-6, -1), // tab
	81: new Point(-5, -1), // Q
	87: new Point(-4, -1), // W
	69: new Point(-3, -1), // E
	82: new Point(-2, -1), // R
	84: new Point(-1, -1), // T
	89: new Point(0, -1), // Y
	85: new Point(1, -1), // U
	73: new Point(2, -1), // I
	79: new Point(3, -1), // O
	80: new Point(4, -1), // P
	219: new Point(5, -1), // [
	//221: new Point(6, -1), // ]
	13: new Point(7, -1), // enter
	
	//20: new Point(-6, 0), // caps lock
	65: new Point(-5, 0), // A
	83: new Point(-4, 0), // S
	68: new Point(-3, 0), // D
	70: new Point(-2, 0), // F
	71: new Point(-1, 0), // G
	72: new Point(0, 0), // H
	74: new Point(1, 0), // J
	75: new Point(2, 0), // K
	76: new Point(3, 0), // L
	186: new Point(4, 0), // ;
	222: new Point(5, 0), // '
	//220: new Point(6, 0), // \
	
	90: new Point(-5, 1), // Z
	88: new Point(-4, 1), // X
	67: new Point(-3, 1), // C
	86: new Point(-2, 1), // V
	66: new Point(-1, 1), // B
	78: new Point(0, 1), // N
	77: new Point(1, 1), // M
	188: new Point(2, 1), // ,
	190: new Point(3, 1), // .
	191: new Point(4, 1), // /
	//16: new Point(5, 1), // shift
};

const codeToCoords_mac = {
	"Backslash": new Point(6, 0), // \
	"ShiftRight": new Point(5, 1),
	"IntlBackslash": new Point(-6, 1),
	"ShiftLeft": new Point(-7, 1),
	"Backquote": new Point(-6, -2),
	"BracketRight": new Point(6, -1), // ]
};
let codeToCoords: {[index:string]: Point} = {};
const keyCodeToCoords = {};

const codeToCoords_dell = {
	"Backquote": new Point(-6, -2), // `
	"Digit1": new Point(-5, -2), // 1
	"Digit2": new Point(-4, -2), // 2
	"Digit3": new Point(-3, -2), // 3
	"Digit4": new Point(-2, -2), // 4
	"Digit5": new Point(-1, -2), // 5
	"Digit6": new Point(0, -2), // 6
	"Digit7": new Point(1, -2), // 7
	"Digit8": new Point(2, -2), // 8
	"Digit9": new Point(3, -2), // 9
	"Digit0": new Point(4, -2), // 0
	"Minus": new Point(5, -2), // -
	"Equal": new Point(6, -2), // =
	"Backspace": new Point(7, -2), // backspace
	
	Tab: new Point(-6, -1), // tab
	KeyQ: new Point(-5, -1), // Q
	87: new Point(-4, -1), // W
	69: new Point(-3, -1), // E
	82: new Point(-2, -1), // R
	84: new Point(-1, -1), // T
	89: new Point(0, -1), // Y
	85: new Point(1, -1), // U
	73: new Point(2, -1), // I
	79: new Point(3, -1), // O
	80: new Point(4, -1), // P
	219: new Point(5, -1), // [
	//221: new Point(6, -1), // ]
	13: new Point(7, -1), // enter
};

(function dell(): void {
	var lines: Array<Array<string>> = [];
	lines[0] = ["Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8"];
	lines[5] = ["F9", "F10", "F11", "F12", "принтскрин", "Insert", "Delete"];
	lines[1] = ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace"];
	lines[2] = ["Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash"];
	lines[3] = ["CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter"];
	lines[4] = ["ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight"];
	
	lines[0].forEach((code, i) =>
		codeToCoords[code] = new Point(-6 + i, -3)
	);
	lines[5].forEach((code, i) =>
		codeToCoords[code] = new Point(-6 + 8 + i, -3)
	);
	lines[1].forEach((code, i) =>
		codeToCoords[code] = new Point(-6 + i, -2)
	);
	lines[2].forEach((code, i) =>
		codeToCoords[code] = new Point(-6 + i, -1)
	);
	lines[3].forEach((code, i) =>
		codeToCoords[code] = new Point(-6 + i, 0)
	);
	lines[4].forEach((code, i) =>
		codeToCoords[code] = new Point(-6 + i, 1)
	);
})();


//check to see if we have params
var init_keyboard_onload: boolean = true;
if (decodeURIComponent(window.location.search) == "")
	init_keyboard_onload = false;

//check\set preset
checkPreset(16);
// fill in form
getHtmlById("settingsForm").onsubmit = goKeyboard;

var getData: Map<string,string|Array<string>> = QueryData(location.search, true);
getInputById("fundamental").value = mapGetMaybe(getData, "fundamental").map(v => v.toString()).unwrapOr("440");
getInputById("rSteps").value = mapGetMaybe(getData, "right").map(v => v.toString()).unwrapOr("3");
getInputById("urSteps").value = mapGetMaybe(getData, "upright").map(v => v.toString()).unwrapOr("10");
getInputById("hexSize").value = mapGetMaybe(getData, "size").map(v => v.toString()).unwrapOr("60");
getInputById("rotation").value = mapGetMaybe(getData, "rotation").map(v => v.toString()).unwrapOr("343.897886248");
getElemById("instrument", HTMLSelectElement).value = mapGetMaybe(getData, "instrument").map(v => v.toString()).unwrapOr("rhodes");
getInputById("enum").checked = mapGetMaybe(getData, "enum").map(v => JSON.parse(v.toString())).unwrapOr("false");
getInputById("equivSteps").value = mapGetMaybe(getData, "equivSteps").map(v => v.toString()).unwrapOr("17");
getInputById("spectrum_colors").checked = mapGetMaybe(getData, "spectrum_colors").map(v => JSON.parse(v.toString())).unwrapOr("false");
getInputById("fundamental_color").value = mapGetMaybe(getData, "fundamental_color").map(v => v.toString()).unwrapOr("#41ff2e");
getInputById("no_labels").checked = mapGetMaybe(getData, "no_labels").map(v => JSON.parse(v.toString())).unwrapOr("false");


var global_pressed_interval: number;
var current_text_color: string = "#000000";

mapGetMaybe(getData, "scale").map(v => getElemById("scale", HTMLTextAreaElement).value = v[0]);
mapGetMaybe(getData, "names").map(v => getElemById("names", HTMLTextAreaElement).value = v[0]);
mapGetMaybe(getData, "note_colors").map(v => getElemById("note_colors", HTMLTextAreaElement).value = v[0]);

hideRevealNames();
hideRevealColors();
hideRevealEnum();

function hideRevealNames(): void {
	if (getInputById("enum").checked) {
		getHtmlById("equivSteps").style.display = "block";
		getHtmlById("names").style.display = "none";
		getHtmlById("numberLabel").style.display = "block";
		getHtmlById("namesLabel").style.display = "none";
	} else {
		getHtmlById("equivSteps").style.display = "none";
		getHtmlById("names").style.display = "block";
		getHtmlById("numberLabel").style.display = "none";
		getHtmlById("namesLabel").style.display = "block";
	}
	changeURL();
}

function hideRevealColors(): void {
	if (getInputById("spectrum_colors").checked) {
		getHtmlById("fundamental_color").style.display = "block";
		getHtmlById("fundamental_colorLabel").style.display = "block";
		getHtmlById("note_colors").style.display = "none";
		getHtmlById("note_colorsLabel").style.display = "none";
	} else {
		getHtmlById("fundamental_color").style.display = "none";
		getHtmlById("fundamental_colorLabel").style.display = "none";
		getHtmlById("note_colors").style.display = "block";
		getHtmlById("note_colorsLabel").style.display = "block";
	}
	changeURL();
}

function hideRevealEnum(): void {
	if (getInputById("no_labels").checked) {
		getInputById("enum").disabled = true;
		getHtmlById("equivSteps").style.display = "none";
		getHtmlById("names").style.display = "none";
		getHtmlById("numberLabel").style.display = "none";
		getHtmlById("namesLabel").style.display = "none";
	} else {
		getInputById("enum").disabled = false;
		if (!getInputById("enum").checked) {
			getHtmlById("namesLabel").style.display = "block";
			getHtmlById("names").style.display = "block";
		} else {
			getHtmlById("equivSteps").style.display = "block";
			getHtmlById("numberLabel").style.display = "block";
		}
	}
	changeURL();
}


function changeURL(): void {
	var url: string = window.location.pathname + "?";
	// add fundamental, right, upright, size
	
	url += "fundamental=" + getInputById("fundamental").value +
		"&right=" + getInputById("rSteps").value +
		"&upright=" + getInputById("urSteps").value +
		"&size=" + getInputById("hexSize").value +
		"&rotation=" + getInputById("rotation").value +
		"&instrument=" + getElemById("instrument", HTMLSelectElement).value +
		"&enum=" + getInputById("enum").checked +
		"&equivSteps=" + getInputById("equivSteps").value +
		"&spectrum_colors=" + getInputById("spectrum_colors").checked +
		"&fundamental_color=" + getInputById("fundamental_color").value +
		"&no_labels=" + getInputById("no_labels").checked;
	
	url += "&scale=";
	url += encodeURIComponent(getElemById("scale", HTMLTextAreaElement).value);
	
	url += "&names=";
	url += encodeURIComponent(getElemById("names", HTMLTextAreaElement).value);
	
	url += "&note_colors=";
	url += encodeURIComponent(getElemById("note_colors", HTMLTextAreaElement).value);
	
	// Find scl file description for the page title
	
	var scaleLines: Array<string> = getElemById("scale", HTMLTextAreaElement).value.split("\n");
	var first: boolean = true;
	var foundDescription: boolean = false;
	var description: string = "Terpstra Keyboard WebApp";
	
	scaleLines.forEach(function(line) {
		if (!foundDescription && !line.match(/^\!/) && line.match(/[a-zA-Z]+/)) {
			foundDescription = true;
			description = line;
		}
	});
	
	document.title = description;
	window.history.replaceState({}, "", url);
}

var settings: {
	activeHexObjects?: Array<ActiveHex>,
	audioContext?: AudioContext,
	canvas?: HTMLCanvasElement,
	centerpoint?: Point,
	context?: CanvasRenderingContext2D,
	enum?: boolean,
	equivInterval?: number,
	equivSteps?: number,
	fundamental?: number,
	fundamental_color?: string,
	hexHeight?: number,
	hexSize?: number,
	hexVert?: number,
	hexWidth?: number,
	isMouseDown?: boolean,
	isTouchDown?: boolean,
	keyCodeToCoords?: {[index:string]: Point},
	keycolors?: Array<string>,
	names?: Array<string>,
	no_labels?: boolean,
	pressedKeys?: Array<number|string>,
	rotation?: number,
	rotationMatrix?: Array<number>,
	rSteps?: number,
	sampleBuffer?: Array<AudioBuffer|undefined>,
	sampleFadeout?: number,
	scale?: Array<number>,
	spectrum_colors?: boolean,
	sustain?: boolean,
	sustainedNotes?: Array<ActiveHex>,
	urSteps?: number,
} = {};

function parseScale(): void {
	settings.scale = [];
	var scaleLines: Array<string> = getElemById("scale", HTMLTextAreaElement).value.split("\n");
	scaleLines.forEach(function(line) {
		if (line.match(/^[1234567890.\s/]+$/) && !line.match(/^\s+$/)) {
			if (line.match(/\//)) {
				// ratio
				var nd: Array<string> = line.split("/");
				var ratio: number = 1200 * Math.log(parseInt(nd[0]) / parseInt(nd[1])) / Math.log(2);
				settings.scale.push(ratio);
			} else {
				if (line.match(/\./))
				// cents
					settings.scale.push(parseFloat(line));
			}
		}
	});
	settings.equivInterval = settings.scale.pop();
	settings.scale.unshift(0);
}

function parseScaleColors(): void {
	settings.keycolors = [];
	var colorsArray: Array<string> = getElemById("note_colors", HTMLTextAreaElement).value.split("\n");
	colorsArray.forEach(function(line) {
		settings.keycolors.push(line);
	});
}

function calculateRotationMatrix(rotation: number, center: Point): Array<number> {
	var m: Array<number> = [];
	m[0] = Math.cos(rotation);
	m[1] = Math.sin(rotation);
	m[2] = -m[1];
	m[3] = m[0];
	m[4] = center.x - m[0] * center.x - m[2] * center.y;
	m[5] = center.y - m[1] * center.x - m[3] * center.y;
	return m;
}

function applyMatrixToPoint(m: Array<number>, p: Point): Point { /*Array, Point*/
	return new Point(
		m[0] * p.x + m[2] * p.y + m[4],
		m[1] * p.x + m[3] * p.y + m[5],
	);
}



class ActiveHex {
	
	public release: boolean = false;
	public freq: number = 440;
	private source: AudioBufferSourceNode;
	private gainNode: GainNode;
	
	public constructor(
		public coords: Point) {}
	
	
	public noteOn(cents: number): void {
		var freq: number = settings.fundamental * Math.pow(2, cents / 1200);
		var source = settings.audioContext.createBufferSource(); // creates a sound source
		// Choose sample
		var sampleFreq: number = 110;
		var sampleNumber: number = 0;
		if (freq > 155) {
			if (freq > 311) {
				if (freq > 622) {
					sampleFreq = 880;
					sampleNumber = 3;
				} else {
					sampleFreq = 440;
					sampleNumber = 2;
				}
			} else {
				sampleFreq = 220;
				sampleNumber = 1;
			}
		}
		
		if (!settings.sampleBuffer[sampleNumber]) // Sample not yet loaded
			return;
		
		source.buffer = settings.sampleBuffer[sampleNumber]; // tell the source which sound to play
		source.playbackRate.value = freq / sampleFreq;
		// Create a gain node.
		var gainNode = settings.audioContext.createGain();
		// Connect the source to the gain node.
		source.connect(gainNode);
		// Connect the gain node to the destination.
		gainNode.connect(settings.audioContext.destination);
		source.connect(gainNode); // connect the source to the context's destination (the speakers)
		gainNode.gain.value = volume;
		source.start(0); // play the source now
		this.source = source;
		this.gainNode = gainNode;
	}
	
	
	public noteOff(): void {
		if (settings.sustain)
			settings.sustainedNotes.push(this);
		else {
			var fadeout: number = settings.audioContext.currentTime + settings.sampleFadeout;
			if (this.gainNode) {
				this.gainNode.gain.setTargetAtTime(0, settings.audioContext.currentTime,
					settings.sampleFadeout);
			}
			if (this.source) {
				// This is a terrible fudge. Please forgive me - it's late, I'm tired, I
				// have a deadline, I've got other shit to do
				this.source.stop(fadeout + 4);
			}
		}
	}
	
}



function resizeHandler(): void {
	// Resize Inner and outer coordinates of canvas to preserve aspect ratio
	
	var newWidth: number = window.innerWidth;
	var newHeight: number = window.innerHeight;
	
	let canvas = settings.canvas;
	if (canvas === undefined)
		throw new TypeError();
	canvas.style.height = newHeight + "px";
	canvas.style.width = newWidth + "px";
	
	canvas.style.marginTop = (-newHeight / 2) + "px";
	canvas.style.marginLeft = (-newWidth / 2) + "px";
	
	canvas.width = newWidth;
	canvas.height = newHeight;
	
	// Find new centerpoint
	
	var centerX: number = newWidth / 2;
	var centerY: number = newHeight / 2;
	settings.centerpoint = new Point(centerX, centerY);
	
	// Rotate about it
	
	if (settings.rotationMatrix)
		settings.context.restore();
	settings.context.save();
	
	settings.rotationMatrix = calculateRotationMatrix(-settings.rotation, settings.centerpoint);
	
	var m: Array<number> = calculateRotationMatrix(settings.rotation, settings.centerpoint);
	settings.context.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
	
	// Redraw Grid
	
	drawGrid();
}

let is_key_event_added;

function back(): void {
	// Remove key listener
	window.removeEventListener("keydown", onKeyDown);
	window.removeEventListener("keyup", onKeyUp);
	is_key_event_added = undefined;
	// Stop all active notes
	while (settings.activeHexObjects.length > 0) {
		var coords: Point = settings.activeHexObjects[0].coords;
		settings.activeHexObjects[0].noteOff();
		drawHex(coords, centsToColor(hexCoordsToCents(coords), false));
		settings.activeHexObjects.splice(0, 1);
	}
	// UI change
	getHtmlById("keyboard").style.display = "none";
	getHtmlById("backButton").style.display = "none";
	getHtmlById("landing-page").style.display = "block";
	document.body.style.overflow = "scroll";
}

function goKeyboard() {
	changeURL();
	
	// Set up screen
	
	getHtmlById("landing-page").style.display = "none";
	getHtmlById("keyboard").style.display = "block";
	document.body.style.overflow = "hidden";
	getHtmlById("backButton").style.display = "block";
	
	// set up settings constants
	
	settings.fundamental = getInputById("fundamental").value;
	settings.rSteps = getInputById("rSteps").value;
	settings.urSteps = parseFloat(settings.rSteps) - parseFloat(getInputById("urSteps").value); // Adjust to different coordinate system
	settings.hexSize = getInputById("hexSize").value;
	settings.rotation = (getInputById("rotation").value * 2 * Math.PI) / 360;
	parseScale();
	parseScaleColors();
	settings.names = getElemById("names", HTMLTextAreaElement).value.split("\n");
	settings["enum"] = getInputById("enum").checked;
	settings.equivSteps = parseInt(getInputById("equivSteps").value);
	
	settings.canvas = getElemById("keyboard", HTMLCanvasElement);
	settings.context = settings.canvas.getContext("2d");
	
	settings.hexHeight = settings.hexSize * 2;
	settings.hexVert = settings.hexHeight * 3 / 4;
	settings.hexWidth = Math.sqrt(3) / 2 * settings.hexHeight;
	
	settings.no_labels = getInputById("no_labels").checked;
	settings.spectrum_colors = getInputById("spectrum_colors").checked;
	settings.fundamental_color = getInputById("fundamental_color").value;
	
	// Set up resize handler
	
	window.addEventListener("resize", resizeHandler, false);
	window.addEventListener("orientationchange", resizeHandler, false);
	
	//... and give it an initial call
	
	resizeHandler();
	
	// Set up synth
	
	settings.sampleBuffer = [undefined, undefined, undefined];
	var instrumentOption = getElemById("instrument", HTMLSelectElement).selectedIndex;
	var instruments: Array<{fileName:string, fade:number}> = [
		{fileName: "piano", fade: 0.1},
		{fileName: "harpsichord", fade: 0.2},
		{fileName: "rhodes", fade: 0.1},
		{fileName: "harp", fade: 0.2},
		{fileName: "choir", fade: 0.5},
		{fileName: "strings", fade: 0.9},
		{fileName: "sawtooth", fade: 0.2},
		{fileName: "gayageum", fade: 1},
		{fileName: "qanun", fade: 1},
		{fileName: "organ", fade: 0.1},
		{fileName: "organleslie", fade: 0.1},
		{fileName: "marimba", fade: 0.1},
		{fileName: "musicbox", fade: 0.1},
		{fileName: "WMRI3LST", fade: 0.1},
		{fileName: "WMRI5LST", fade: 0.1},
		{fileName: "WMRI5Lpike", fade: 0.1},
		{fileName: "WMRI7LST", fade: 0.1},
		{fileName: "WMRI11LST", fade: 0.1},
		{fileName: "WMRI13LST", fade: 0.1},
		{fileName: "WMRInLST", fade: 0.1},
		{fileName: "WMRIByzantineST", fade: 0.1},
	];
	
	//console.log(instruments[instrumentOption]);
	
	loadSample(instruments[instrumentOption].fileName, 0);
	settings.sampleFadeout = instruments[instrumentOption].fade;
	
	// Set up keyboard, touch and mouse event handlers
	
	settings.sustain = false;
	settings.sustainedNotes = [];
	//settings.canvas.addEventListener("keydown", onKeyDown, false); // Firefox isn't firing :(
	//settings.canvas.addEventListener("keyup", onKeyUp, false);
	
	if (typeof(is_key_event_added) == "undefined") {
		is_key_event_added = 1;
		settings.pressedKeys = [];
		settings.keyCodeToCoords = keyCodeToCoords/*{
			49: new Point(-5, -2), // 1
			50: new Point(-4, -2), // 2
			51: new Point(-3, -2), // 3
			52: new Point(-2, -2), // 4
			53: new Point(-1, -2), // 5
			54: new Point(0, -2), // 6
			55: new Point(1, -2), // 7
			56: new Point(2, -2), // 8
			57: new Point(3, -2), // 9
			48: new Point(4, -2), // 0
			189: new Point(5, -2), // -
			187: new Point(6, -2), // =
			
			81: new Point(-5, -1), // Q
			87: new Point(-4, -1), // W
			69: new Point(-3, -1), // E
			82: new Point(-2, -1), // R
			84: new Point(-1, -1), // T
			89: new Point(0, -1), // Y
			85: new Point(1, -1), // U
			73: new Point(2, -1), // I
			79: new Point(3, -1), // O
			80: new Point(4, -1), // P
			219: new Point(5, -1), // [
			221: new Point(6, -1), // ]
			
			65: new Point(-5, 0), // A
			83: new Point(-4, 0), // S
			68: new Point(-3, 0), // D
			70: new Point(-2, 0), // F
			71: new Point(-1, 0), // G
			72: new Point(0, 0), // H
			74: new Point(1, 0), // J
			75: new Point(2, 0), // K
			76: new Point(3, 0), // L
			186: new Point(4, 0), // ;
			222: new Point(5, 0), // '
			
			90: new Point(-5, 1), // Z
			88: new Point(-4, 1), // X
			67: new Point(-3, 1), // C
			86: new Point(-2, 1), // V
			66: new Point(-1, 1), // B
			78: new Point(0, 1), // N
			77: new Point(1, 1), // M
			188: new Point(2, 1), // ,
			190: new Point(3, 1), // .
			191: new Point(4, 1), // /
		};*/
		window.addEventListener("keydown", onKeyDown, false);
		window.addEventListener("keyup", onKeyUp, false);
	}
	
	//iPad Shake to toggle sustain
	if (typeof window.DeviceMotionEvent != "undefined") {
		var lastShakeCheck: number = 0;
		var lastShakeCount: number = 0;
		
		// Shake sensitivity (a lower number is more)
		var sensitivity: number = 5;
		
		// Position variables
		var x1: number = 0,
			y1: number = 0,
			z1: number = 0,
			x2: number = 0,
			y2: number = 0,
			z2: number = 0;
		
		// Listen to motion events and update the position
		window.addEventListener("devicemotion", function(e) {
			x1 = e.accelerationIncludingGravity.x;
			y1 = e.accelerationIncludingGravity.y;
			z1 = e.accelerationIncludingGravity.z;
		}, false);
		
		// Periodically check the position and fire
		// if the change is greater than the sensitivity
		setInterval(function() {
			lastShakeCheck++;
			var change: number = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);
			
			if (change > sensitivity) {
				
				if (lastShakeCheck - lastShakeCount >= 3) {
					lastShakeCount = lastShakeCheck;
					
					if (settings.sustain == true) {
						settings.sustain = false;
						for (var note = 0; note < settings.sustainedNotes.length; note++)
							settings.sustainedNotes[note].noteOff();
						settings.sustainedNotes = [];
						tempAlert("Sustain Off", 900);
					} else {
						settings.sustain = true;
						tempAlert("Sustain On", 900);
					}
				}
			}
			
			// Update new position
			x2 = x1;
			y2 = y1;
			z2 = z1;
		}, 300);
	}
	
	//
	
	settings.activeHexObjects = [];
	settings.isTouchDown = false;
	settings.canvas.addEventListener("touchstart", handleTouch, false);
	settings.canvas.addEventListener("touchend", handleTouch, false);
	settings.canvas.addEventListener("touchmove", handleTouch, false);
	
	settings.isMouseDown = false;
	settings.canvas.addEventListener("mousedown", function(e) {
		if (settings.pressedKeys.length != 0 || settings.isTouchDown)
			return;
		settings.isMouseDown = true;
		settings.canvas.addEventListener("mousemove", mouseActive, false);
		mouseActive(e);
	}, false);
	
	settings.canvas.addEventListener("mouseup", function(e) {
		settings.isMouseDown = false;
		if (settings.pressedKeys.length != 0 || settings.isTouchDown)
			return;
		settings.canvas.removeEventListener("mousemove", mouseActive);
		if (settings.activeHexObjects.length > 0) {
			var coords: Point = settings.activeHexObjects[0].coords;
			settings.activeHexObjects[0].noteOff();
			drawHex(coords, centsToColor(hexCoordsToCents(coords), false));
			settings.activeHexObjects.pop();
		}
	}, false);
	return false;
}

function onKeyDown(e: KeyboardEvent): void {
	e.preventDefault();//
	
	if (e.keyCode == 32) // Spacebar
		settings.sustain = true;
	else if (!settings.isMouseDown && !settings.isTouchDown
			&& (e.keyCode in settings.keyCodeToCoords)
			&& settings.pressedKeys.indexOf(e.keyCode) == -1) {
		settings.pressedKeys.push(e.keyCode);
		var coords: Point = settings.keyCodeToCoords[e.keyCode];
		var hex: ActiveHex = new ActiveHex(coords);
		settings.activeHexObjects.push(hex);
		var cents: number = hexCoordsToCents(coords);
		drawHex(coords, centsToColor(cents, true));
		hex.noteOn(cents);
	}
	
	//Hatsevich:
	else if (!settings.isMouseDown && !settings.isTouchDown
			&& (e.code in codeToCoords)
			&& settings.pressedKeys.indexOf(e.code) == -1) {
		settings.pressedKeys.push(e.code);
		var coords: Point = codeToCoords[e.code];
		var hex: ActiveHex = new ActiveHex(coords);
		settings.activeHexObjects.push(hex);
		var cents: number = hexCoordsToCents(coords);
		drawHex(coords, centsToColor(cents, true));
		hex.noteOn(cents);
	}
}

function onKeyUp(e: KeyboardEvent): void {
	if (e.keyCode == 32) { // Spacebar
		settings.sustain = false;
		for (var note = 0; note < settings.sustainedNotes.length; note++)
			settings.sustainedNotes[note].noteOff();
		settings.sustainedNotes = [];
	} else if (!settings.isMouseDown && !settings.isTouchDown
			&& (e.keyCode in settings.keyCodeToCoords)) {
		var keyIndex = settings.pressedKeys.indexOf(e.keyCode);
		if (keyIndex != -1) {
			settings.pressedKeys.splice(keyIndex, 1);
			var coords: Point = settings.keyCodeToCoords[e.keyCode];
			drawHex(coords, centsToColor(hexCoordsToCents(coords), false));
			var hexIndex: number = settings.activeHexObjects.findIndex(function(hex) {
				return coords.equals(hex.coords);
			});
			if (hexIndex != -1) {
				settings.activeHexObjects[hexIndex].noteOff();
				settings.activeHexObjects.splice(hexIndex, 1);
			}
		}
	}
	
	//Hatsevich:
	else if (!settings.isMouseDown && !settings.isTouchDown
			&& (e.code in codeToCoords)) {
		var keyIndex: number = settings.pressedKeys.indexOf(e.code);
		if (keyIndex != -1) {
			settings.pressedKeys.splice(keyIndex, 1);
			var coords: Point = codeToCoords[e.code];
			drawHex(coords, centsToColor(hexCoordsToCents(coords), false));
			var hexIndex: number = settings.activeHexObjects.findIndex(function(hex) {
				return coords.equals(hex.coords);
			});
			if (hexIndex != -1) {
				settings.activeHexObjects[hexIndex].noteOff();
				settings.activeHexObjects.splice(hexIndex, 1);
			}
		}
	}
}

function mouseActive(e: MouseEvent): void {
	var coords: Point = getPointerPosition(e);
	
	coords = getHexCoordsAt(coords);
	
	if (settings.activeHexObjects.length == 0) {
		settings.activeHexObjects[0] = new ActiveHex(coords);
		var cents: number = hexCoordsToCents(coords);
		settings.activeHexObjects[0].noteOn(cents);
		drawHex(coords, centsToColor(cents, true));
	} else {
		if (!coords.equals(settings.activeHexObjects[0].coords)) {
			settings.activeHexObjects[0].noteOff();
			drawHex(settings.activeHexObjects[0].coords,
				centsToColor(hexCoordsToCents(settings.activeHexObjects[0].coords, false)));
			
			settings.activeHexObjects[0] = new ActiveHex(coords);
			var cents: number = hexCoordsToCents(coords);
			settings.activeHexObjects[0].noteOn(cents);
			drawHex(coords, centsToColor(cents, true));
		}
	}
}

function getPointerPosition(e: MouseEvent): Point {
	var parentPosition = getPosition(e.currentTarget);
	var xPosition: number = e.clientX - parentPosition.x;
	var yPosition: number = e.clientY - parentPosition.y;
	return new Point(xPosition, yPosition);
}

function getPosition(element): {x:number, y:number} {
	var xPosition: number = 0;
	var yPosition: number = 0;
	
	while (element) {
		xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
		yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
		element = element.offsetParent;
	}
	return {
		x: xPosition,
		y: yPosition,
	};
}

function handleTouch(e): void {
	e.preventDefault();
	if (settings.pressedKeys.length != 0 || settings.isMouseDown) {
		settings.isTouchDown = false;
		return;
	}
	settings.isTouchDown = e.targetTouches.length != 0;
	
	for (var i = 0; i < settings.activeHexObjects.length; i++)
		settings.activeHexObjects[i].release = true;
	
	for (var i = 0; i < e.targetTouches.length; i++) {
		var coords: Point = getHexCoordsAt(new Point(e.targetTouches[i].pageX - settings.canvas.offsetLeft,
			e.targetTouches[i].pageY - settings.canvas.offsetTop));
		var found: boolean = false;
		
		for (var j = 0; j < settings.activeHexObjects.length; j++) {
			if (coords.equals(settings.activeHexObjects[j].coords)) {
				settings.activeHexObjects[j].release = false;
				found = true;
			}
		}
		if (!found) {
			var newHex: ActiveHex = new ActiveHex(coords);
			var cents: number = hexCoordsToCents(coords);
			newHex.noteOn(cents);
			var c: string = centsToColor(cents, true);
			drawHex(coords, c);
			settings.activeHexObjects.push(newHex);
		}
	}
	
	for (var i = settings.activeHexObjects.length - 1; i >= 0; i--) {
		if (settings.activeHexObjects[i].release) {
			settings.activeHexObjects[i].noteOff();
			var coords: Point = settings.activeHexObjects[i].coords;
			var c: string = centsToColor(hexCoordsToCents(coords), false);
			drawHex(coords, c);
			settings.activeHexObjects.splice(i, 1);
		}
	}
}

function drawGrid(): void {
	var max: number = settings.centerpoint.x > settings.centerpoint.y ?
		settings.centerpoint.x / settings.hexSize :
		settings.centerpoint.y / settings.hexSize;
	max = Math.floor(max);
	for (var r = -max; r < max; r++) {
		for (var ur = -max; ur < max; ur++) {
			var coords: Point = new Point(r, ur);
			var c: string = centsToColor(hexCoordsToCents(coords), false);
			drawHex(coords, c);
		}
	}
}

function hexCoordsToScreen(hex: Point): Point { /* Point */
	var screenX: number = settings.centerpoint.x + hex.x * settings.hexWidth + hex.y * settings.hexWidth / 2;
	var screenY: number = settings.centerpoint.y + hex.y * settings.hexVert;
	return new Point(screenX, screenY);
}

function drawHex(p: Point, c: string): void { /* Point, color */
	var hexCenter: Point = hexCoordsToScreen(p);
	
	// Calculate hex vertices
	
	var x: Array<number> = [];
	var y: Array<number> = [];
	for (var i = 0; i < 6; i++) {
		var angle: number = 2 * Math.PI / 6 * (i + 0.5);
		x[i] = hexCenter.x + settings.hexSize * Math.cos(angle);
		y[i] = hexCenter.y + settings.hexSize * Math.sin(angle);
	}
	
	// Draw filled hex
	
	let context = settings.context;
	if (context === undefined)
		throw new TypeError();
	context.beginPath();
	context.moveTo(x[0], y[0]);
	for (var i = 1; i < 6; i++)
		context.lineTo(x[i], y[i]);
	context.closePath();
	context.fillStyle = c;
	context.fill();
	
	// Save context and create a hex shaped clip
	
	context.save();
	context.beginPath();
	context.moveTo(x[0], y[0]);
	for (var i = 1; i < 6; i++)
		context.lineTo(x[i], y[i]);
	context.closePath();
	context.clip();
	
	// Calculate hex vertices outside clipped path
	
	var x2: Array<number> = [];
	var y2: Array<number> = [];
	for (var i = 0; i < 6; i++) {
		var angle: number = 2 * Math.PI / 6 * (i + 0.5);
		x2[i] = hexCenter.x + (parseFloat(settings.hexSize) + 3) * Math.cos(angle);
		y2[i] = hexCenter.y + (parseFloat(settings.hexSize) + 3) * Math.sin(angle);
	}
	
	// Draw shadowed stroke outside clip to create pseudo-3d effect
	
	context.beginPath();
	context.moveTo(x2[0], y2[0]);
	for (var i = 1; i < 6; i++)
		context.lineTo(x2[i], y2[i]);
	context.closePath();
	context.strokeStyle = "black";
	context.lineWidth = 5;
	context.shadowBlur = 15;
	context.shadowColor = "black";
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.stroke();
	context.restore();
	
	// Add a clean stroke around hex
	
	context.beginPath();
	context.moveTo(x[0], y[0]);
	for (var i = 1; i < 6; i++)
		context.lineTo(x[i], y[i]);
	context.closePath();
	context.lineWidth = 2;
	context.lineJoin = "round";
	context.strokeStyle = "black";
	context.stroke();
	
	// Add note name and equivalence interval multiple
	
	context.save();
	context.translate(hexCenter.x, hexCenter.y);
	context.rotate(-settings.rotation);
	// hexcoords = p and screenCoords = hexCenter
	
	//context.fillStyle = "black"; //bdl_04062016
	context.fillStyle = getContrastYIQ(current_text_color);
	context.font = "22pt Arial";
	context.textAlign = "center";
	context.textBaseline = "middle";
	
	var note: number = p.x * settings.rSteps + p.y * settings.urSteps;
	var equivSteps: number = settings["enum"] ? parseInt(settings.equivSteps) : settings.scale.length;
	var equivMultiple: number = Math.floor(note / equivSteps);
	var reducedNote: number = note % equivSteps;
	if (reducedNote < 0)
		reducedNote = equivSteps + reducedNote;
	
	if (!settings.no_labels) {
		var name: string = settings["enum"] ? "" + reducedNote : settings.names[reducedNote];
		if (name) {
			context.save();
			var scaleFactor: number = name.length > 3 ? 3 / name.length : 1;
			scaleFactor *= settings.hexSize / 50;
			context.scale(scaleFactor, scaleFactor);
			context.fillText(name, 0, 0);
			context.restore();
		}
		
		var scaleFactor: number = settings.hexSize / 50;
		context.scale(scaleFactor, scaleFactor);
		context.translate(10, -25);
		context.fillStyle = "white";
		context.font = "12pt Arial";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText(equivMultiple, 0, 0);
	}
	
	context.restore();
}

function centsToColor(cents: number, pressed: boolean): string {
	var returnColor: string;
	if (!settings.spectrum_colors) {
		if (typeof(settings.keycolors[global_pressed_interval]) === "undefined")
			returnColor = "#EDEDE4";
		else
			returnColor = settings.keycolors[global_pressed_interval];
		
		var oldColor: string = returnColor;
		
		//convert color name to hex
		returnColor = nameToHex(returnColor);
		
		current_text_color = returnColor;
		
		//convert the hex to rgb
		let returnColor1: Array<number> = hex2rgb(returnColor);
		
		//darken for pressed key
		if (pressed) {
			returnColor1[0] -= 90;
			returnColor1[1] -= 90;
		}
		
		return rgb(returnColor1[0], returnColor1[1], returnColor1[2]);
	}
	
	var fcolor: Array<number> = hex2rgb("#" + settings.fundamental_color);
	let fcolor1 = rgb2hsv(fcolor[0], fcolor[1], fcolor[2]);
	
	var h: number = fcolor1.h / 360;
	var s: number = fcolor1.s / 100;
	var v: number = fcolor1.v / 100;
	//var h = 145 / 360; // green
	var reduced: number = (cents / 1200) % 1;
	if (reduced < 0)
		reduced += 1;
	h = (reduced + h) % 1;
	
	v = pressed ? v - (v / 2) : v;
	
	returnColor = HSVtoRGB(h, s, v);
	
	//setup text color
	var tcolor = HSVtoRGB2(h, s, v);
	current_text_color = rgbToHex(tcolor.red, tcolor.green, tcolor.blue);
	return returnColor;
}

function roundTowardZero(val: number): number {
	if (val < 0)
		return Math.ceil(val);
	return Math.floor(val);
}

function hexCoordsToCents(coords: Point): number {
	var distance: number = coords.x * settings.rSteps + coords.y * settings.urSteps;
	var octs: number = roundTowardZero(distance / settings.scale.length);
	var reducedSteps = distance % settings.scale.length;
	if (reducedSteps < 0) {
		reducedSteps += settings.scale.length;
		octs -= 1;
	}
	var cents: number = octs * settings.equivInterval + settings.scale[reducedSteps];
	global_pressed_interval = reducedSteps;
	return cents;
}

function getHexCoordsAt(coords: Point): Point {
	coords = applyMatrixToPoint(settings.rotationMatrix, coords);
	var x: number = coords.x - settings.centerpoint.x;
	var y: number = coords.y - settings.centerpoint.y;
	
	var q: number = (x * Math.sqrt(3) / 3 - y / 3) / settings.hexSize;
	var r: number = y * 2 / 3 / settings.hexSize;
	
	q = Math.round(q);
	r = Math.round(r);
	
	var guess: Point = hexCoordsToScreen(new Point(q, r));
	
	// This gets an approximation; now check neighbours for minimum distance
	
	var minimum: number = 100000;
	var closestHex: Point = new Point(q, r);
	for (var qOffset = -1; qOffset < 2; qOffset++) {
		for (var rOffset = -1; rOffset < 2; rOffset++) {
			var neighbour: Point = new Point(q + qOffset, r + rOffset);
			var diff: Point = hexCoordsToScreen(neighbour).minus(coords);
			var distance: number = diff.x * diff.x + diff.y * diff.y;
			if (distance < minimum) {
				minimum = distance;
				closestHex = neighbour;
			}
		}
	}
	
	return closestHex;
}

function rgb(r: number, g: number, b: number): string {
	return "rgb(" + r + "," + g + "," + b + ")";
}

function HSVtoRGB(h: number, s: number, v: number): string {
	var r: number, g: number, b: number, i: number, f: number, p: number, q: number, t: number;
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0:
			r = v; g = t; b = p;
			break;
		case 1:
			r = q; g = v; b = p;
			break;
		case 2:
			r = p; g = v; b = t;
			break;
		case 3:
			r = p; g = q; b = v;
			break;
		case 4:
			r = t; g = p; b = v;
			break;
		case 5:
			r = v; g = p; b = q;
			break;
		default:
			throw new Error("Unreachable");
	}
	return rgb(Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255));
}

function HSVtoRGB2(h: number, s: number, v: number): {red:number, green:number, blue:number} {
	var r: number, g: number, b: number, i: number, f: number, p: number, q: number, t: number;
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0:
			r = v; g = t; b = p;
			break;
		case 1:
			r = q; g = v; b = p;
			break;
		case 2:
			r = p; g = v; b = t;
			break;
		case 3:
			r = p; g = q; b = v;
			break;
		case 4:
			r = t; g = p; b = v;
			break;
		case 5:
			r = v; g = p; b = q;
			break;
		default:
			throw new Error("Unreachable");
	}
	
	return {
		red: Math.floor(r * 255),
		green: Math.floor(g * 255),
		blue: Math.floor(b * 255),
	};
}

window.addEventListener("load", init, false);

function init(): void {
	try {
		// Fix up for prefixing
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		settings.audioContext = new AudioContext();
	} catch (e) {
		alert("Web Audio API is not supported in this browser");
	}
}

function loadSample(name: string, iteration: number): void {
	// It seems audioContext doesn't cope with simultaneous decodeAudioData calls ):
	
	var sampleFreqs: Array<string> = ["110", "220", "440", "880"];
	//for (var i = 0; i < 4; ++i) {
	var request = new XMLHttpRequest();
	var url: string = "sounds/" + name + sampleFreqs[iteration] + ".mp3";
	//console.log(iteration);
	request.open("GET", url, true);
	request.responseType = "arraybuffer";
	
	// Decode asynchronously
	request.onload = function() {
		settings.audioContext.decodeAudioData(request.response, function(buffer) {
			settings.sampleBuffer[iteration] = buffer;
			if (iteration < 3)
				loadSample(name, iteration + 1);
		}, onLoadError);
	};
	request.send();
	//}
}

function onLoadError(e: Event): void {
	alert("Couldn't load sample");
}


function tempAlert(msg: string, duration: number): void {
	var el: HTMLElement = document.createElement("div");
	el.setAttribute("style", "position:absolute;top:40%;left:20%;background-color:white; font-size:25px;");
	el.innerHTML = msg;
	setTimeout(function() {
		el.parentNode.removeChild(el);
	}, duration);
	document.body.appendChild(el);
}


function nameToHex(colour: string): string {
	var colours: {[index:string]: string} = {
		"aliceblue": "#f0f8ff",
		"antiquewhite": "#faebd7",
		"aqua": "#00ffff",
		"aquamarine": "#7fffd4",
		"azure": "#f0ffff",
		"beige": "#f5f5dc",
		"bisque": "#ffe4c4",
		"black": "#000000",
		"blanchedalmond": "#ffebcd",
		"blue": "#0000ff",
		"blueviolet": "#8a2be2",
		"brown": "#a52a2a",
		"burlywood": "#deb887",
		"cadetblue": "#5f9ea0",
		"chartreuse": "#7fff00",
		"chocolate": "#d2691e",
		"coral": "#ff7f50",
		"cornflowerblue": "#6495ed",
		"cornsilk": "#fff8dc",
		"crimson": "#dc143c",
		"cyan": "#00ffff",
		"darkblue": "#00008b",
		"darkcyan": "#008b8b",
		"darkgoldenrod": "#b8860b",
		"darkgray": "#a9a9a9",
		"darkgreen": "#006400",
		"darkkhaki": "#bdb76b",
		"darkmagenta": "#8b008b",
		"darkolivegreen": "#556b2f",
		"darkorange": "#ff8c00",
		"darkorchid": "#9932cc",
		"darkred": "#8b0000",
		"darksalmon": "#e9967a",
		"darkseagreen": "#8fbc8f",
		"darkslateblue": "#483d8b",
		"darkslategray": "#2f4f4f",
		"darkturquoise": "#00ced1",
		"darkviolet": "#9400d3",
		"deeppink": "#ff1493",
		"deepskyblue": "#00bfff",
		"dimgray": "#696969",
		"dodgerblue": "#1e90ff",
		"firebrick": "#b22222",
		"floralwhite": "#fffaf0",
		"forestgreen": "#228b22",
		"fuchsia": "#ff00ff",
		"gainsboro": "#dcdcdc",
		"ghostwhite": "#f8f8ff",
		"gold": "#ffd700",
		"goldenrod": "#daa520",
		"gray": "#808080",
		"green": "#008000",
		"greenyellow": "#adff2f",
		"honeydew": "#f0fff0",
		"hotpink": "#ff69b4",
		"indianred": "#cd5c5c",
		"indigo": "#4b0082",
		"ivory": "#fffff0",
		"khaki": "#f0e68c",
		"lavender": "#e6e6fa",
		"lavenderblush": "#fff0f5",
		"lawngreen": "#7cfc00",
		"lemonchiffon": "#fffacd",
		"lightblue": "#add8e6",
		"lightcoral": "#f08080",
		"lightcyan": "#e0ffff",
		"lightgoldenrodyellow": "#fafad2",
		"lightgrey": "#d3d3d3",
		"lightgreen": "#90ee90",
		"lightpink": "#ffb6c1",
		"lightsalmon": "#ffa07a",
		"lightseagreen": "#20b2aa",
		"lightskyblue": "#87cefa",
		"lightslategray": "#778899",
		"lightsteelblue": "#b0c4de",
		"lightyellow": "#ffffe0",
		"lime": "#00ff00",
		"limegreen": "#32cd32",
		"linen": "#faf0e6",
		"magenta": "#ff00ff",
		"maroon": "#800000",
		"mediumaquamarine": "#66cdaa",
		"mediumblue": "#0000cd",
		"mediumorchid": "#ba55d3",
		"mediumpurple": "#9370d8",
		"mediumseagreen": "#3cb371",
		"mediumslateblue": "#7b68ee",
		"mediumspringgreen": "#00fa9a",
		"mediumturquoise": "#48d1cc",
		"mediumvioletred": "#c71585",
		"midnightblue": "#191970",
		"mintcream": "#f5fffa",
		"mistyrose": "#ffe4e1",
		"moccasin": "#ffe4b5",
		"navajowhite": "#ffdead",
		"navy": "#000080",
		"oldlace": "#fdf5e6",
		"olive": "#808000",
		"olivedrab": "#6b8e23",
		"orange": "#ffa500",
		"orangered": "#ff4500",
		"orchid": "#da70d6",
		"palegoldenrod": "#eee8aa",
		"palegreen": "#98fb98",
		"paleturquoise": "#afeeee",
		"palevioletred": "#d87093",
		"papayawhip": "#ffefd5",
		"peachpuff": "#ffdab9",
		"peru": "#cd853f",
		"pink": "#ffc0cb",
		"plum": "#dda0dd",
		"powderblue": "#b0e0e6",
		"purple": "#800080",
		"red": "#ff0000",
		"rosybrown": "#bc8f8f",
		"royalblue": "#4169e1",
		"saddlebrown": "#8b4513",
		"salmon": "#fa8072",
		"sandybrown": "#f4a460",
		"seagreen": "#2e8b57",
		"seashell": "#fff5ee",
		"sienna": "#a0522d",
		"silver": "#c0c0c0",
		"skyblue": "#87ceeb",
		"slateblue": "#6a5acd",
		"slategray": "#708090",
		"snow": "#fffafa",
		"springgreen": "#00ff7f",
		"steelblue": "#4682b4",
		"tan": "#d2b48c",
		"teal": "#008080",
		"thistle": "#d8bfd8",
		"tomato": "#ff6347",
		"turquoise": "#40e0d0",
		"violet": "#ee82ee",
		"wheat": "#f5deb3",
		"white": "#ffffff",
		"whitesmoke": "#f5f5f5",
		"yellow": "#ffff00",
		"yellowgreen": "#9acd32",
	};

	if (typeof colours[colour.toLowerCase()] != "undefined")
		return colours[colour.toLowerCase()];
	else if (colour.indexOf("#") == 0)
		return colour;
	else if (colour.length == 6 && colour.indexOf("#") == -1)
		return "#" + colour;
	
	return "#EDEDE4"; //default button color!
}

function hex2rgb(col: string): Array<number> {
	var r: string, g: string, b: string;
	if (col.charAt(0) == "#")
		col = col.substr(1);
	r = col.charAt(0) + col.charAt(1);
	g = col.charAt(2) + col.charAt(3);
	b = col.charAt(4) + col.charAt(5);
	return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
}

function rgb2hsv(r1: number, g1: number, b1: number): {h:number, s:number, v:number} {
	var rr: number, gg: number, bb: number,
		r: number = arguments[0] / 255,
		g: number = arguments[1] / 255,
		b: number = arguments[2] / 255,
		h: number, s: number,
		v: number = Math.max(r, g, b),
		diff: number = v - Math.min(r, g, b),
		diffc = function(c: number): number {
			return (v - c) / 6 / diff + 1 / 2;
		};
	
	if (diff == 0)
		h = s = 0;
	else {
		s = diff / v;
		rr = diffc(r);
		gg = diffc(g);
		bb = diffc(b);
		
		if (r === v)
			h = bb - gg;
		else if (g === v)
			h = (1 / 3) + rr - bb;
		else if (b === v)
			h = (2 / 3) + gg - rr;
		else
			throw new Error("Unreachable");
		if (h < 0)
			h += 1;
		else if (h > 1)
			h -= 1;
	}
	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		v: Math.round(v * 100),
	};
}

function getContrastYIQ(hexcolor: string): string {
	hexcolor = hexcolor.replace("#", "");
	var r: number = parseInt(hexcolor.substr(0, 2), 16);
	var g: number = parseInt(hexcolor.substr(2, 2), 16);
	var b: number = parseInt(hexcolor.substr(4, 2), 16);
	var yiq: number = ((r * 299) + (g * 587) + (b * 114)) / 1000;
	return yiq >= 128 ? "black" : "white";
}

function rgbToHex(r: number, g: number, b: number): string {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


function checkPreset(init: number): void {
	var mselect: HTMLSelectElement = getElemById("quicklinks", HTMLSelectElement);
	var url_str: string = window.location.href;
	
	//first check for .htm as end of url and set the default preset (31ET)
	if (url_str.substr(url_str.length - 4) == ".htm")
		mselect.value = mselect.options[init].value;
	for (var i = 0; i < mselect.length; i++) {
		if (url_str.indexOf(mselect.options[i].value) != -1) {
			//this is the correct preset
			mselect.value = mselect.options[i].value;
		}
	}
}


let ms: HTMLSelectElement|null;

function noPreset(): void {
	ms = getElemById("quicklinks", HTMLSelectElement);
	ms.value = ms.options[0].value;
}


function getHtmlById(id: string): HTMLElement {
	return getElemById(id, HTMLElement);
}


function getInputById(id: string): HTMLInputElement {
	return getElemById(id, HTMLInputElement);
}


type Constructor<T> = { new(...args: Array<any>): T };

function getElemById<T>(id: string, type: Constructor<T>): T {
	const result: HTMLElement|null = document.getElementById(id);
	if (result instanceof type)
		return result;
	else if (result === null)
		throw new Error("Element not found");
	else
		throw new TypeError("Invalid element type");
}


//initialize keyboard on load
if (init_keyboard_onload) {
	//hide landing page
	getHtmlById("landing-page").style.display = "none";
	setTimeout(function() { goKeyboard(); }, 1500);
}
