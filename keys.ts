let volume: number = 1.4;

function initialize(): void {
	const initKeyboardOnload: boolean = window.location.search != "";
	
	getHtmlById("settingsForm").onsubmit = goKeyboard;
	
	{
		const params: URLSearchParams = new URL(window.location.href).searchParams;
		
		function getOr(key: string, defaultVal: string): string {
			const val: string|null = params.get(key);
			return val !== null ? val : defaultVal;
		}
		
		function doIfPresent(key: string, func: (val:string)=>void): void {
			const val: string|null = params.get(key);
			if (val !== null)
				func(val);
		}
		
		fundamentalInput.value = getOr("fundamental", "440");
		rStepsInput.value = getOr("right", "3");
		urStepsInput.value = getOr("upright", "10");
		hexSizeInput.value = getOr("size", "60");
		rotationInput.value = getOr("rotation", "-16.1");
		instrumentSelect.value = getOr("instrument", "rhodes");
		enumInput.checked = getOr("enum", "false") == "true";
		equivStepsInput.value = getOr("equivSteps", "17");
		spectrumColorsInput.checked = getOr("spectrum_colors", "false") == "true";
		getInputById("custom_colors").checked = !spectrumColorsInput.checked;
		
		fundamentalColorInput.value = getOr("fundamental_color", "#41ff2e");
		noLabelsInput.checked = getOr("no_labels", "false") == "true";
		getInputById("custom_labels").checked = !noLabelsInput.checked && !enumInput.checked;
		
		doIfPresent("scale", v => scaleTextarea.value = v);
		doIfPresent("names", v => namesTextarea.value = v);
		doIfPresent("note_colors", v => noteColorsTextarea.value = v);
	}
	
	hideRevealNames();
	hideRevealColors();
	hideRevealEnum();
	
	if (initKeyboardOnload) {
		setElemVisible("landing-page", false);
		setTimeout(goKeyboard, 1500);
	}
}


let audioContext: AudioContext;
try {
	audioContext = new AudioContext();
} catch (e) {
	alert("Web Audio API is not supported in this browser");
	throw e;
}



class Point {
	public constructor(
		public readonly x: number,
		public readonly y: number) {}
	
	public equals(p: Point): boolean {
		return this.x == p.x && this.y == p.y;
	}
	
	public plus(p: Point): Point {
		return new Point(this.x + p.x, this.y + p.y);
	}
	
	public minus(p: Point): Point {
		return new Point(this.x - p.x, this.y - p.y);
	}
}



class Rgb8Color {
	
	public static fromCssHex(s: string): Rgb8Color {
		while (s.startsWith("#"))
			s = s.substring(1);
		return new Rgb8Color(
			parseInt(s.substring(0, 2), 16),
			parseInt(s.substring(2, 4), 16),
			parseInt(s.substring(4, 6), 16));
	}
	
	
	public constructor(
		public readonly red: number,
		public readonly green: number,
		public readonly blue: number) {}
	
	
	public toCssRgb(): string {
		return `rgb(${this.red},${this.green},${this.blue})`;
	}
	
}


function rgb2hsv(rgb: Rgb8Color): {h:number, s:number, v:number} {
	let rr: number, gg: number, bb: number,
		r: number = rgb.red / 255,
		g: number = rgb.green / 255,
		b: number = rgb.blue / 255,
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
			h = 1 / 3 + rr - bb;
		else if (b === v)
			h = 2 / 3 + gg - rr;
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


function HSVtoRGB(h: number, s: number, v: number): Rgb8Color {
	let r: number, g: number, b: number, i: number, f: number, p: number, q: number, t: number;
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
	
	return new Rgb8Color(Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255));
}


function getContrastYIQ({red, green, blue}: Rgb8Color): string {
	return (red * 299 + green * 587 + blue * 114) / 1000 >= 128 ? "black" : "white";
}


function nameToHex(color: string): string {
	const colors: {[index:string]: string} = {
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

	if (typeof colors[color.toLowerCase()] != "undefined")
		return colors[color.toLowerCase()];
	else if (color.indexOf("#") == 0)
		return color;
	else if (color.length == 6 && color.indexOf("#") == -1)
		return "#" + color;
	
	return "#EDEDE4";
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
	"BracketRight": new Point(6, -1),
};
let codeToCoords: {[index:string]: Point} = {};
const keyCodeToCoords: {[index:number]: Point} = {};

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
	let lines: Array<Array<string>> = [];
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


// HTML elements
let fundamentalInput: HTMLInputElement = getInputById("fundamental");
let rStepsInput: HTMLInputElement = getInputById("rSteps");
let urStepsInput: HTMLInputElement = getInputById("urSteps");
let hexSizeInput: HTMLInputElement = getInputById("hexSize");
let rotationInput: HTMLInputElement = getInputById("rotation");
let instrumentSelect: HTMLSelectElement = getElemById("instrument", HTMLSelectElement);
let enumInput: HTMLInputElement = getInputById("enum");
let equivStepsInput: HTMLInputElement = getInputById("equivSteps");
let spectrumColorsInput: HTMLInputElement = getInputById("spectrum_colors");
let fundamentalColorInput: HTMLInputElement = getInputById("fundamental_color");
let noLabelsInput: HTMLInputElement = getInputById("no_labels");
let scaleTextarea: HTMLTextAreaElement = getElemById("scale", HTMLTextAreaElement);
let namesTextarea: HTMLTextAreaElement = getElemById("names", HTMLTextAreaElement);
let noteColorsTextarea: HTMLTextAreaElement = getElemById("note_colors", HTMLTextAreaElement);
let canvas: HTMLCanvasElement = getElemById("keyboard", HTMLCanvasElement);

let context: CanvasRenderingContext2D;
{
	const ctx = canvas.getContext("2d");
	if (ctx === null)
		throw new Error("Assertion error");
	context = ctx;
}
let globalPressedInterval: number;
let currentTextColor: Rgb8Color = new Rgb8Color(0, 0, 0);


function hideRevealNames(): void {
	const c: boolean = enumInput.checked;
	setElemVisible("equivSteps", c);
	setElemVisible("names", !c);
	setElemVisible("numberLabel", c);
	setElemVisible("namesLabel", !c);
}

function hideRevealColors(): void {
	const c: boolean = spectrumColorsInput.checked;
	setElemVisible("fundamental_color", c);
	setElemVisible("fundamental_colorLabel", c);
	setElemVisible("note_colors", !c);
	setElemVisible("note_colorsLabel", !c);
}

function hideRevealEnum(): void {
	if (noLabelsInput.checked) {
		setElemVisible("equivSteps", false);
		setElemVisible("names", false);
		setElemVisible("numberLabel", false);
		setElemVisible("namesLabel", false);
	} else {
		if (!enumInput.checked) {
			setElemVisible("namesLabel", true);
			setElemVisible("names", true);
		} else {
			setElemVisible("equivSteps", true);
			setElemVisible("numberLabel", true);
		}
	}
}


function changeURL(): void {
	// Find scl file description for the page title
	try {
		const scl: ScalaScale = new ScalaScale(scaleTextarea.value);
		if (scl.description == "")
			throw new RangeError("Empty description");
		document.title = scl.description;
	} catch (e) {
		document.title = "Terpstra Keyboard WebApp";
	}
	
	const params: Array<[string,string]> = [
		["fundamental", fundamentalInput.value],
		["right", rStepsInput.value],
		["upright", urStepsInput.value],
		["size", hexSizeInput.value],
		["rotation", rotationInput.value],
		["instrument", instrumentSelect.value],
		["enum", enumInput.checked.toString()],
		["equivSteps", equivStepsInput.value],
		["spectrum_colors", spectrumColorsInput.checked.toString()],
		["fundamental_color", encodeURIComponent(fundamentalColorInput.value)],
		["no_labels", noLabelsInput.checked.toString()],
		["scale", encodeURIComponent(scaleTextarea.value)],
		["names", encodeURIComponent(namesTextarea.value)],
		["note_colors", encodeURIComponent(noteColorsTextarea.value)],
	];
	const url: string = window.location.pathname + "?" + params.map(kv => kv.join("=")).join("&");
	window.history.replaceState({}, "", url);
}


function calculateRotationMatrix(angleRad: number, center: Point): Array<number> {
	let m: Array<number> = [];
	m[0] = Math.cos(angleRad);
	m[1] = Math.sin(angleRad);
	m[2] = -m[1];
	m[3] = m[0];
	m[4] = center.x - m[0] * center.x - m[2] * center.y;
	m[5] = center.y - m[1] * center.x - m[3] * center.y;
	return m;
}

function applyMatrixToPoint(m: Array<number>, p: Point): Point {
	return new Point(
		m[0] * p.x + m[2] * p.y + m[4],
		m[1] * p.x + m[3] * p.y + m[5],
	);
}


let isKeyEventAdded: boolean = false;


function goKeyboard() {
	changeURL();
	
	// Set up screen
	
	setElemVisible("landing-page", false);
	setElemVisible("keyboard", true);
	setElemVisible("backButton", true);
	
	// set up settings constants
	
	const fundamental: number = parseFloat(fundamentalInput.value);
	const rSteps: number = parseFloat(rStepsInput.value);
	const urSteps: number = rSteps - parseFloat(urStepsInput.value); // Adjust to different coordinate system
	const hexSize: number = parseFloat(hexSizeInput.value);
	const rotationRad: number = parseFloat(rotationInput.value) * Math.PI / 180;
	
	const scale: ScalaScale = new ScalaScale(scaleTextarea.value);
	const equivIntervalCents: number = scale.pitchesCents[scale.pitchesCents.length - 1];
	
	const keycolors: Array<string> = noteColorsTextarea.value.split("\n");
	
	const names: Array<string> = namesTextarea.value.split("\n");
	const enumerateScale: boolean = enumInput.checked;
	const equivSteps: number = parseInt(equivStepsInput.value);
	
	const hexHeight: number = hexSize * 2;
	const hexVert: number = hexHeight * 3 / 4;
	const hexWidth: number = Math.sqrt(3) / 2 * hexHeight;
	
	const no_labels: boolean = noLabelsInput.checked;
	const spectrum_colors: boolean = spectrumColorsInput.checked;
	const fundamental_color: string = fundamentalColorInput.value;
	
	function handleVolume(e: KeyboardEvent): void {
		if (e.code == "ArrowDown") {
			e.preventDefault();
			volume = Math.max(volume - 0.1, 0);
		} else if (e.code == "ArrowUp") {
			e.preventDefault();
			volume = Math.max(volume + 0.1, 3);
		}
	};
	window.addEventListener("keydown", handleVolume);
	
	// Set up resize handler
	
	window.addEventListener("resize", resizeHandler, false);
	window.addEventListener("orientationchange", resizeHandler, false);
	
	//... and give it an initial call
	
	let rotationMatrix: Array<number> = [];
	let centerpoint: Point = new Point(0, 0);
	resizeHandler();
	
	// Set up synth
	
	let sampleBuffer: Array<AudioBuffer|undefined> = [undefined, undefined, undefined];
	const instrumentOption: number = instrumentSelect.selectedIndex;
	const instruments: Array<{fileName:string, fade:number}> = [
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
	
	loadSamples(instruments[instrumentOption].fileName);
	const sampleFadeout: number = instruments[instrumentOption].fade;
	
	// Set up keyboard, touch and mouse event handlers
	
	let sustain: boolean = false;
	let sustainedNotes: Array<ActiveHex> = [];
	//canvas.addEventListener("keydown", onKeyDown, false); // Firefox isn't firing :(
	//canvas.addEventListener("keyup", onKeyUp, false);
	
	let pressedKeys: Array<number|string> = [];
	
	if (!isKeyEventAdded) {
		isKeyEventAdded = true;
		pressedKeys = [];
		/*{
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
	let deviceMotion: any = undefined;
	if (typeof window.DeviceMotionEvent != "undefined") {
		let lastShakeCheck: number = 0;
		let lastShakeCount: number = 0;
		
		// Shake sensitivity (a lower number is more)
		const sensitivity: number = 5;
		
		// Position variables
		let x1: number = 0,
			y1: number = 0,
			z1: number = 0,
			x2: number = 0,
			y2: number = 0,
			z2: number = 0;
		
		// Listen to motion events and update the position
		window.addEventListener("devicemotion", deviceMotion, false);
		
		deviceMotion = function(e: DeviceMotionEvent): void {
			x1 = e.accelerationIncludingGravity.x;
			y1 = e.accelerationIncludingGravity.y;
			z1 = e.accelerationIncludingGravity.z;
		};
		
		// Periodically check the position and fire
		// if the change is greater than the sensitivity
		setInterval(() => {
			lastShakeCheck++;
			const change: number = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);
			
			if (change > sensitivity) {
				
				if (lastShakeCheck - lastShakeCount >= 3) {
					lastShakeCount = lastShakeCheck;
					
					if (sustain == true) {
						sustain = false;
						for (let note of sustainedNotes)
							note.noteOff();
						sustainedNotes = [];
						tempAlert("Sustain Off", 900);
					} else {
						sustain = true;
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
	
	let activeHexObjects: Array<ActiveHex> = [];
	let isTouchDown: boolean = false;
	canvas.addEventListener("touchstart", handleTouch, false);
	canvas.addEventListener("touchend", handleTouch, false);
	canvas.addEventListener("touchmove", handleTouch, false);
	
	let isMouseDown: boolean = false;
	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mouseup", mouseUp, false);
	
	
	function centsToColor(cents: number, pressed: boolean): string {
		if (spectrum_colors) {
			const fcolor: Rgb8Color = Rgb8Color.fromCssHex("#" + fundamental_color);
			let fcolor1 = rgb2hsv(fcolor);
			
			let h: number = fcolor1.h / 360;
			let s: number = fcolor1.s / 100;
			let v: number = fcolor1.v / 100;
			//const h = 145 / 360; // green
			let reduced: number = (cents / 1200) % 1;
			if (reduced < 0)
				reduced += 1;
			h = (reduced + h) % 1;
			if (pressed)
				v /= 2;
			
			//setup text color
			currentTextColor = HSVtoRGB(h, s, v);
			return currentTextColor.toCssRgb();
			
		} else {
			let colorStr: string;
			if (typeof keycolors[globalPressedInterval] === "undefined")
				colorStr = "#EDEDE4";
			else
				colorStr = keycolors[globalPressedInterval];
			
			currentTextColor = Rgb8Color.fromCssHex(nameToHex(colorStr));
			
			let {red, green, blue} = currentTextColor;
			
			//darken for pressed key
			if (pressed) {
				red -= 90;
				green -= 90;
			}
			
			return new Rgb8Color(red, green, blue).toCssRgb();
		}
	}
	
	
	
	class ActiveHex {
		
		public release: boolean = false;
		public freq: number = 440;
		private source: AudioBufferSourceNode|null = null;
		private gainNode: GainNode|null = null;
		
		public constructor(
			public coords: Point) {}
		
		
		public noteOn(cents: number): void {
			const freq: number = fundamental * Math.pow(2, cents / 1200);
			let source = audioContext.createBufferSource(); // creates a sound source
			// Choose sample
			let sampleFreq: number;
			let sampleNumber: number;
			if (freq <= 155) {
				sampleFreq = 110;
				sampleNumber = 0;
			} else if (freq <= 311) {
				sampleFreq = 220;
				sampleNumber = 1;
			} else if (freq <= 622) {
				sampleFreq = 440;
				sampleNumber = 2;
			} else {
				sampleFreq = 880;
				sampleNumber = 3;
			}
			
			if (!sampleBuffer[sampleNumber]) // Sample not yet loaded
				return;
			
			source.buffer = sampleBuffer[sampleNumber] ?? null; // tell the source which sound to play
			source.playbackRate.value = freq / sampleFreq;
			let gainNode = audioContext.createGain();
			source.connect(gainNode);
			gainNode.connect(audioContext.destination);
			source.connect(gainNode); // connect the source to the context's destination (the speakers)
			gainNode.gain.value = volume;
			source.start(0); // play the source now
			this.source = source;
			this.gainNode = gainNode;
		}
		
		
		public noteOff(): void {
			if (sustain)
				sustainedNotes.push(this);
			else {
				const fadeout: number = audioContext.currentTime + sampleFadeout;
				if (this.gainNode !== null) {
					this.gainNode.gain.setTargetAtTime(0, audioContext.currentTime,
						sampleFadeout);
				}
				if (this.source !== null) {
					// This is a hack
					this.source.stop(fadeout + 4);
				}
			}
		}
		
	}
	
	
	
	function resizeHandler(): void {
		// Resize Inner and outer coordinates of canvas to preserve aspect ratio
		
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		// Find new centerpoint
		
		const centerX: number = canvas.width / 2;
		const centerY: number = canvas.height / 2;
		centerpoint = new Point(centerX, centerY);
		
		// Rotate about it
		
		if (rotationMatrix)
			context.restore();
		context.save();
		
		rotationMatrix = calculateRotationMatrix(-rotationRad, centerpoint);
		
		const m: Array<number> = calculateRotationMatrix(rotationRad, centerpoint);
		context.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
		
		// Redraw Grid
		
		drawGrid();
	}
	
	
	function back(): void {
		window.removeEventListener("resize", resizeHandler, false);
		window.removeEventListener("orientationchange", resizeHandler, false);
		window.removeEventListener("keydown", handleVolume);
		window.removeEventListener("keydown", onKeyDown);
		window.removeEventListener("keyup", onKeyUp);
		if (deviceMotion !== undefined)
			window.removeEventListener("devicemotion", deviceMotion, false);
		canvas.removeEventListener("touchstart", handleTouch, false);
		canvas.removeEventListener("touchend", handleTouch, false);
		canvas.removeEventListener("touchmove", handleTouch, false);
		canvas.removeEventListener("mousedown", mouseDown, false);
		canvas.removeEventListener("mouseup", mouseUp, false);
		isKeyEventAdded = false;
		// Stop all active notes
		while (activeHexObjects.length > 0) {
			const coords: Point = activeHexObjects[0].coords;
			activeHexObjects[0].noteOff();
			drawHex(coords, centsToColor(hexCoordsToCents(coords), false));
			activeHexObjects.splice(0, 1);
		}
		window.history.replaceState({}, "", window.location.pathname);
		// UI change
		setElemVisible("keyboard", false);
		setElemVisible("backButton", false);
		setElemVisible("landing-page", true);
	}
	
	getHtmlById("backButton").onclick = back;
	
	
	function onKeyDown(e: KeyboardEvent): void {
		e.preventDefault();
		
		if (e.keyCode == 32) // Spacebar
			sustain = true;
		else if (!isMouseDown && !isTouchDown
				&& e.keyCode in keyCodeToCoords
				&& pressedKeys.indexOf(e.keyCode) == -1) {
			pressedKeys.push(e.keyCode);
			const coords: Point = keyCodeToCoords[e.keyCode];
			const hex: ActiveHex = new ActiveHex(coords);
			activeHexObjects.push(hex);
			const cents: number = hexCoordsToCents(coords);
			drawHex(coords, centsToColor(cents, true));
			hex.noteOn(cents);
		}
		
		//Hatsevich:
		else if (!isMouseDown && !isTouchDown
				&& e.code in codeToCoords
				&& pressedKeys.indexOf(e.code) == -1) {
			pressedKeys.push(e.code);
			const coords: Point = codeToCoords[e.code];
			const hex: ActiveHex = new ActiveHex(coords);
			activeHexObjects.push(hex);
			const cents: number = hexCoordsToCents(coords);
			drawHex(coords, centsToColor(cents, true));
			hex.noteOn(cents);
		}
	}
	
	function onKeyUp(e: KeyboardEvent): void {
		if (e.keyCode == 32) { // Spacebar
			sustain = false;
			for (let note of sustainedNotes)
				note.noteOff();
			sustainedNotes = [];
		} else if (!isMouseDown && !isTouchDown
				&& e.keyCode in keyCodeToCoords) {
			const keyIndex: number = pressedKeys.indexOf(e.keyCode);
			if (keyIndex != -1) {
				pressedKeys.splice(keyIndex, 1);
				const coords: Point = keyCodeToCoords[e.keyCode];
				drawHex(coords, centsToColor(hexCoordsToCents(coords), false));
				const hexIndex: number = activeHexObjects.findIndex(
					(hex: ActiveHex) => coords.equals(hex.coords));
				if (hexIndex != -1) {
					activeHexObjects[hexIndex].noteOff();
					activeHexObjects.splice(hexIndex, 1);
				}
			}
		}
		
		//Hatsevich:
		else if (!isMouseDown && !isTouchDown
				&& e.code in codeToCoords) {
			const keyIndex: number = pressedKeys.indexOf(e.code);
			if (keyIndex != -1) {
				pressedKeys.splice(keyIndex, 1);
				const coords: Point = codeToCoords[e.code];
				drawHex(coords, centsToColor(hexCoordsToCents(coords), false));
				const hexIndex: number = activeHexObjects.findIndex(
					(hex: ActiveHex) => coords.equals(hex.coords));
				if (hexIndex != -1) {
					activeHexObjects[hexIndex].noteOff();
					activeHexObjects.splice(hexIndex, 1);
				}
			}
		}
	}
	
	
	function mouseDown(e: MouseEvent): void {
		if (pressedKeys.length != 0 || isTouchDown)
			return;
		isMouseDown = true;
		canvas.addEventListener("mousemove", mouseActive, false);
		mouseActive(e);
	}
	
	
	function mouseUp(e: MouseEvent): void {
		isMouseDown = false;
		if (pressedKeys.length != 0 || isTouchDown)
			return;
		canvas.removeEventListener("mousemove", mouseActive);
		if (activeHexObjects.length > 0) {
			const coords: Point = activeHexObjects[0].coords;
			activeHexObjects[0].noteOff();
			drawHex(coords, centsToColor(hexCoordsToCents(coords), false));
			activeHexObjects.pop();
		}
	}
	
	
	function mouseActive(e: MouseEvent): void {
		let coords: Point = getPointerPosition(e);
		
		coords = getHexCoordsAt(coords);
		
		if (activeHexObjects.length == 0) {
			activeHexObjects[0] = new ActiveHex(coords);
			const cents: number = hexCoordsToCents(coords);
			activeHexObjects[0].noteOn(cents);
			drawHex(coords, centsToColor(cents, true));
		} else if (!coords.equals(activeHexObjects[0].coords)) {
			activeHexObjects[0].noteOff();
			drawHex(activeHexObjects[0].coords,
				centsToColor(hexCoordsToCents(activeHexObjects[0].coords), false));
			
			activeHexObjects[0] = new ActiveHex(coords);
			const cents: number = hexCoordsToCents(coords);
			activeHexObjects[0].noteOn(cents);
			drawHex(coords, centsToColor(cents, true));
		}
	}
	
	
	function handleTouch(e: TouchEvent): void {
		e.preventDefault();
		if (pressedKeys.length != 0 || isMouseDown) {
			isTouchDown = false;
			return;
		}
		isTouchDown = e.targetTouches.length != 0;
		
		for (let hex of activeHexObjects)
			hex.release = true;
		
		for (let i = 0; i < e.targetTouches.length; i++) {
			const coords: Point = getHexCoordsAt(new Point(e.targetTouches[i].pageX - canvas.offsetLeft,
				e.targetTouches[i].pageY - canvas.offsetTop));
			let found: boolean = false;
			
			for (let hex of activeHexObjects) {
				if (coords.equals(hex.coords)) {
					hex.release = false;
					found = true;
				}
			}
			if (!found) {
				let newHex: ActiveHex = new ActiveHex(coords);
				const cents: number = hexCoordsToCents(coords);
				newHex.noteOn(cents);
				const c: string = centsToColor(cents, true);
				drawHex(coords, c);
				activeHexObjects.push(newHex);
			}
		}
		
		for (let i = activeHexObjects.length - 1; i >= 0; i--) {
			if (activeHexObjects[i].release) {
				activeHexObjects[i].noteOff();
				const coords: Point = activeHexObjects[i].coords;
				const c: string = centsToColor(hexCoordsToCents(coords), false);
				drawHex(coords, c);
				activeHexObjects.splice(i, 1);
			}
		}
	}
	
	function drawGrid(): void {
		let max: number = centerpoint.x > centerpoint.y ?
			centerpoint.x / hexSize :
			centerpoint.y / hexSize;
		max = Math.floor(max);
		for (let r = -max; r < max; r++) {
			for (let ur = -max; ur < max; ur++) {
				const coords: Point = new Point(r, ur);
				const c: string = centsToColor(hexCoordsToCents(coords), false);
				drawHex(coords, c);
			}
		}
	}
	
	function hexCoordsToScreen(hex: Point): Point {
		const screenX: number = centerpoint.x + hex.x * hexWidth + hex.y * hexWidth / 2;
		const screenY: number = centerpoint.y + hex.y * hexVert;
		return new Point(screenX, screenY);
	}
	
	function drawHex(p: Point, c: string): void {
		const hexCenter: Point = hexCoordsToScreen(p);
		
		// Calculate hex vertices
		
		let x: Array<number> = [];
		let y: Array<number> = [];
		for (let i = 0; i < 6; i++) {
			const angle: number = 2 * Math.PI / 6 * (i + 0.5);
			x[i] = hexCenter.x + hexSize * Math.cos(angle);
			y[i] = hexCenter.y + hexSize * Math.sin(angle);
		}
		
		// Draw filled hex
		
		context.beginPath();
		context.moveTo(x[0], y[0]);
		for (let i = 1; i < 6; i++)
			context.lineTo(x[i], y[i]);
		context.closePath();
		context.fillStyle = c;
		context.fill();
		
		// Save context and create a hex shaped clip
		
		context.save();
		context.beginPath();
		context.moveTo(x[0], y[0]);
		for (let i = 1; i < 6; i++)
			context.lineTo(x[i], y[i]);
		context.closePath();
		context.clip();
		
		// Calculate hex vertices outside clipped path
		
		let x2: Array<number> = [];
		let y2: Array<number> = [];
		for (let i = 0; i < 6; i++) {
			const angle: number = 2 * Math.PI / 6 * (i + 0.5);
			x2[i] = hexCenter.x + (hexSize + 3) * Math.cos(angle);
			y2[i] = hexCenter.y + (hexSize + 3) * Math.sin(angle);
		}
		
		// Draw shadowed stroke outside clip to create pseudo-3d effect
		
		context.beginPath();
		context.moveTo(x2[0], y2[0]);
		for (let i = 1; i < 6; i++)
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
		for (let i = 1; i < 6; i++)
			context.lineTo(x[i], y[i]);
		context.closePath();
		context.lineWidth = 2;
		context.lineJoin = "round";
		context.strokeStyle = "black";
		context.stroke();
		
		// Add note name and equivalence interval multiple
		
		context.save();
		context.translate(hexCenter.x, hexCenter.y);
		context.rotate(-rotationRad);
		// hexcoords = p and screenCoords = hexCenter
		
		//context.fillStyle = "black"; //bdl_04062016
		context.fillStyle = getContrastYIQ(currentTextColor);
		context.font = "22pt Arial";
		context.textAlign = "center";
		context.textBaseline = "middle";
		
		const note: number = p.x * rSteps + p.y * urSteps;
		const equivSteps1: number = enumerateScale ? equivSteps : scale.pitchesCents.length - 1;
		const equivMultiple: number = Math.floor(note / equivSteps1);
		let reducedNote: number = note % equivSteps1;
		if (reducedNote < 0)
			reducedNote += equivSteps1;
		
		if (!no_labels) {
			const name: string = enumerateScale ? "" + reducedNote : names[reducedNote];
			if (name) {
				context.save();
				let scaleFactor: number = name.length > 3 ? 3 / name.length : 1;
				scaleFactor *= hexSize / 50;
				context.scale(scaleFactor, scaleFactor);
				context.fillText(name, 0, 0);
				context.restore();
			}
			
			const scaleFactor: number = hexSize / 50;
			context.scale(scaleFactor, scaleFactor);
			context.translate(10, -25);
			context.fillStyle = getContrastYIQ(currentTextColor) == "black" ? "#505050" : "#E0E0E0";
			context.font = "12pt Arial";
			context.textAlign = "center";
			context.textBaseline = "middle";
			context.fillText(((equivMultiple > 0 ? "+" : "") + equivMultiple).replace(/-/, "\u2212"), 0, 0);
		}
		
		context.restore();
	}
	
	
	function hexCoordsToCents(coords: Point): number {
		const distance: number = coords.x * rSteps + coords.y * urSteps;
		const numPitches: number = scale.pitchesCents.length - 1;
		let octs: number = roundTowardZero(distance / numPitches);
		let reducedSteps = distance % numPitches;
		if (reducedSteps < 0) {
			reducedSteps += numPitches;
			octs -= 1;
		}
		const cents: number = octs * equivIntervalCents + scale.pitchesCents[reducedSteps];
		globalPressedInterval = reducedSteps;
		return cents;
	}
	
	function getHexCoordsAt(coords: Point): Point {
		coords = applyMatrixToPoint(rotationMatrix, coords);
		const x: number = coords.x - centerpoint.x;
		const y: number = coords.y - centerpoint.y;
		
		let q: number = (x * Math.sqrt(3) / 3 - y / 3) / hexSize;
		let r: number = y * 2 / 3 / hexSize;
		
		q = Math.round(q);
		r = Math.round(r);
		
		// This gets an approximation; now check neighbors for minimum distance
		
		let minimum: number = 100000;
		let closestHex: Point = new Point(q, r);
		for (let qOffset = -1; qOffset < 2; qOffset++) {
			for (let rOffset = -1; rOffset < 2; rOffset++) {
				const neigbor: Point = new Point(q + qOffset, r + rOffset);
				const diff: Point = hexCoordsToScreen(neigbor).minus(coords);
				const distance: number = Math.hypot(diff.x, diff.y);
				if (distance < minimum) {
					minimum = distance;
					closestHex = neigbor;
				}
			}
		}
		
		return closestHex;
	}
	
	
	async function loadSamples(name: string): Promise<void> {
		const sampleFreqs: Array<string> = ["110", "220", "440", "880"];
		const responses: Array<Promise<Response>> = sampleFreqs.map(freq => fetch(`sounds/${name}${freq}.mp3`));
		// It seems audioContext doesn't cope with simultaneous decodeAudioData calls ):
		for (let i = 0; i < responses.length; i++) {
			const arrayBuf: ArrayBuffer = await (await responses[i]).arrayBuffer();
			try {
				const audioBuf: AudioBuffer = await audioContext.decodeAudioData(arrayBuf);
				sampleBuffer[i] = audioBuf;
			} catch (e) {
				alert("Couldn't load sample");
			}
		}
	}
	
	
	return false;
}



class ScalaScale {
	
	public readonly description: string;
	public readonly pitchesCents: Readonly<Array<number>>;
	
	
	public constructor(text: string) {
		let lines: Array<string> = text.split("\n").filter(line => !line.startsWith("!"));
		{
			const head: string|undefined = lines.shift();
			if (head === undefined)
				throw new RangeError("Missing description");
			this.description = head;
		}
		
		lines = lines.filter(line => !/^\s*$/.test(line));
		let numPitches: number;
		{
			const head: string|undefined = lines.shift();
			if (head === undefined)
				throw new RangeError("Missing number of pitches");
			const mat: Array<string>|null = head.match(/^\s*(\d+)\s*$/);
			if (mat === null)
				throw new RangeError("Invalid number of pitches"+head);
			numPitches = parseInt(mat[1], 10);
		}
		
		if (lines.length != numPitches)
			throw new RangeError("Mismatched number of pitches");
		let pitches: Array<number> = [0];
		for (const line of lines) {
			const numStr = line.replace(/^\s+/, "").replace(/\s.*$/, "");
			if (numStr.match(/^\d+\.\d*$/) !== null)
				pitches.push(parseFloat(numStr));
			else if (numStr.match(/^\d+$/) !== null)
				pitches.push(Math.log(parseInt(numStr, 10)) / Math.log(2) * 1200);
			else if (numStr.match(/^\d+\/\d+$/) !== null) {
				const [numer, denom] = numStr.split("/");
				pitches.push(Math.log(parseInt(numer, 10) / parseInt(denom, 10)) / Math.log(2) * 1200);
			} else
				throw new RangeError("Invalid pitch value: " + numStr);
		}
		this.pitchesCents = pitches;
	}
	
}



function getPointerPosition(e: MouseEvent): Point {
	const target = e.currentTarget;
	if (!(target instanceof HTMLElement))
		throw new TypeError();
	return new Point(e.clientX, e.clientY).minus(getPosition(target));
}

function getPosition(element: HTMLElement): Point {
	let position: Point = new Point(0, 0);
	while (true) {
		position = position.plus(new Point(
			element.offsetLeft - element.scrollLeft + element.clientLeft,
			element.offsetTop - element.scrollTop + element.clientTop));
		const parent = element.offsetParent;
		if (parent === null)
			return position;
		if (!(parent instanceof HTMLElement))
			throw new TypeError();
		element = parent;
	}
}


function roundTowardZero(val: number): number {
	if (val < 0)
		return Math.ceil(val);
	return Math.floor(val);
}


function tempAlert(msg: string, durationMs: number): void {
	let el: HTMLElement = document.createElement("div");
	el.textContent = msg;
	el.style.position = "absolute";
	el.style.top = "40%";
	el.style.left = "20%";
	el.style.backgroundColor = "white";
	el.style.fontSize = "25px";
	document.body.append(el);
	setTimeout(() => el.remove(), durationMs);
}


function presetChanged(): void {
	window.history.replaceState({}, "", getElemById("quicklinks", HTMLSelectElement).value);
	const params: URLSearchParams = new URL(window.location.href).searchParams;
	
	function getOr(key: string, defaultVal: string): string {
		const val: string|null = params.get(key);
		return val !== null ? val : defaultVal;
	}
	
	function doIfPresent(key: string, func: (val:string)=>void): void {
		const val: string|null = params.get(key);
		if (val !== null)
			func(val);
	}
	
	fundamentalInput.value = getOr("fundamental", "440");
	rStepsInput.value = getOr("right", "3");
	urStepsInput.value = getOr("upright", "10");
	hexSizeInput.value = getOr("size", "60");
	rotationInput.value = getOr("rotation", "-16.1");
	instrumentSelect.value = getOr("instrument", "rhodes");
	enumInput.checked = getOr("enum", "false") == "true";
	equivStepsInput.value = getOr("equivSteps", "17");
	spectrumColorsInput.checked = getOr("spectrum_colors", "false") == "true";
	getInputById("custom_colors").checked = !spectrumColorsInput.checked;
	fundamentalColorInput.value = getOr("fundamental_color", "#41ff2e");
	noLabelsInput.checked = getOr("no_labels", "false") == "true";
	getInputById("custom_labels").checked = !noLabelsInput.checked && !enumInput.checked;
	
	doIfPresent("scale", v => scaleTextarea.value = v);
	doIfPresent("names", v => namesTextarea.value = v);
	doIfPresent("note_colors", v => noteColorsTextarea.value = v);
	
	hideRevealNames();
	hideRevealColors();
	hideRevealEnum();
	
	setElemVisible("landing-page", false);
	goKeyboard();
}


function noPreset(): void {
	getElemById("quicklinks", HTMLSelectElement).selectedIndex = 0;
}


function setElemVisible(id: string, vis: boolean): void {
	getHtmlById(id).style.display = vis ? "block" : "none";
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


function notUndefined<T>(val: T|undefined): T {
	if (val === undefined)
		throw new TypeError();
	return val;
}


initialize();
