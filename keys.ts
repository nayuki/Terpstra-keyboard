let volume: number = 1.4;
window.addEventListener("keydown", (e: KeyboardEvent) => {
	if (e.code == "ArrowDown") {//ctrl
		e.preventDefault();
		volume = Math.max(volume - 0.1, 0);
	} else if (e.code == "ArrowUp") {
		e.preventDefault();
		volume = Math.max(volume + 0.1, 3);
	}
});


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
		if (s.startsWith("#"))
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
	
	return "#EDEDE4"; //default button color!
}


function centsToColor(cents: number, pressed: boolean): string {
	if (settings.spectrum_colors) {
		const fcolor: Rgb8Color = Rgb8Color.fromCssHex("#" + settings.fundamental_color);
		let fcolor1 = rgb2hsv(fcolor);
		
		let h: number = fcolor1.h / 360;
		let s: number = fcolor1.s / 100;
		let v: number = fcolor1.v / 100;
		//const h = 145 / 360; // green
		let reduced: number = (cents / 1200) % 1;
		if (reduced < 0)
			reduced += 1;
		h = (reduced + h) % 1;
		
		v = pressed ? v / 2 : v;
		
		//setup text color
		currentTextColor = HSVtoRGB(h, s, v);
		return currentTextColor.toCssRgb();
		
	} else {
		let colorStr: string;
		if (typeof(notUndefined(settings.keycolors)[globalPressedInterval]) === "undefined")
			colorStr = "#EDEDE4";
		else
			colorStr = notUndefined(settings.keycolors)[globalPressedInterval];
		
		//convert color name to hex
		currentTextColor = Rgb8Color.fromCssHex(nameToHex(colorStr));
		
		//convert the hex to rgb
		let {red, green, blue} = currentTextColor;
		
		//darken for pressed key
		if (pressed) {
			red -= 90;
			green -= 90;
		}
		
		return new Rgb8Color(red, green, blue).toCssRgb();
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


//check to see if we have params
let initKeyboardOnload: boolean = true;
if (decodeURIComponent(window.location.search) == "")
	initKeyboardOnload = false;

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

//check\set preset
checkPreset(16);
// fill in form
getHtmlById("settingsForm").onsubmit = goKeyboard;

const getData: Map<string,string|Array<string>> = QueryData(location.search, true);
fundamentalInput.value = mapGetMaybe(getData, "fundamental").map(v => v.toString()).unwrapOr("440");
rStepsInput.value = mapGetMaybe(getData, "right").map(v => v.toString()).unwrapOr("3");
urStepsInput.value = mapGetMaybe(getData, "upright").map(v => v.toString()).unwrapOr("10");
hexSizeInput.value = mapGetMaybe(getData, "size").map(v => v.toString()).unwrapOr("60");
rotationInput.value = mapGetMaybe(getData, "rotation").map(v => v.toString()).unwrapOr("343.897886248");
instrumentSelect.value = mapGetMaybe(getData, "instrument").map(v => v.toString()).unwrapOr("rhodes");
enumInput.checked = mapGetMaybe(getData, "enum").map(v => JSON.parse(v.toString())).unwrapOr("false");
equivStepsInput.value = mapGetMaybe(getData, "equivSteps").map(v => v.toString()).unwrapOr("17");
spectrumColorsInput.checked = mapGetMaybe(getData, "spectrum_colors").map(v => JSON.parse(v.toString())).unwrapOr("false");
fundamentalColorInput.value = mapGetMaybe(getData, "fundamental_color").map(v => v.toString()).unwrapOr("#41ff2e");
noLabelsInput.checked = mapGetMaybe(getData, "no_labels").map(v => JSON.parse(v.toString())).unwrapOr("false");


let globalPressedInterval: number;
let currentTextColor: Rgb8Color = new Rgb8Color(0, 0, 0);

mapGetMaybe(getData, "scale").map(v => scaleTextarea.value = v[0]);
mapGetMaybe(getData, "names").map(v => namesTextarea.value = v[0]);
mapGetMaybe(getData, "note_colors").map(v => noteColorsTextarea.value = v[0]);

hideRevealNames();
hideRevealColors();
hideRevealEnum();

function hideRevealNames(): void {
	const c: boolean = enumInput.checked;
	setElemVisible("equivSteps", c);
	setElemVisible("names", !c);
	setElemVisible("numberLabel", c);
	setElemVisible("namesLabel", !c);
	changeURL();
}

function hideRevealColors(): void {
	const c: boolean = spectrumColorsInput.checked;
	setElemVisible("fundamental_color", c);
	setElemVisible("fundamental_colorLabel", c);
	setElemVisible("note_colors", !c);
	setElemVisible("note_colorsLabel", !c);
	changeURL();
}

function hideRevealEnum(): void {
	if (noLabelsInput.checked) {
		enumInput.disabled = true;
		setElemVisible("equivSteps", false);
		setElemVisible("names", false);
		setElemVisible("numberLabel", false);
		setElemVisible("namesLabel", false);
	} else {
		enumInput.disabled = false;
		if (!enumInput.checked) {
			setElemVisible("namesLabel", true);
			setElemVisible("names", true);
		} else {
			setElemVisible("equivSteps", true);
			setElemVisible("numberLabel", true);
		}
	}
	changeURL();
}


function changeURL(): void {
	let url: string = window.location.pathname + "?";
	// add fundamental, right, upright, size
	
	url += "fundamental=" + fundamentalInput.value +
		"&right=" + rStepsInput.value +
		"&upright=" + urStepsInput.value +
		"&size=" + hexSizeInput.value +
		"&rotation=" + rotationInput.value +
		"&instrument=" + instrumentSelect.value +
		"&enum=" + enumInput.checked +
		"&equivSteps=" + equivStepsInput.value +
		"&spectrum_colors=" + spectrumColorsInput.checked +
		"&fundamental_color=" + fundamentalColorInput.value +
		"&no_labels=" + noLabelsInput.checked +
		"&scale=" + encodeURIComponent(scaleTextarea.value) +
		"&names=" + encodeURIComponent(namesTextarea.value) +
		"&note_colors=" + encodeURIComponent(noteColorsTextarea.value);
	
	// Find scl file description for the page title
	
	const scaleLines: Array<string> = scaleTextarea.value.split("\n");
	let foundDescription: boolean = false;
	let description: string = "Terpstra Keyboard WebApp";
	
	scaleLines.forEach((line: string) => {
		if (!foundDescription && !line.match(/^\!/) && line.match(/[a-zA-Z]+/)) {
			foundDescription = true;
			description = line;
		}
	});
	
	document.title = description;
	window.history.replaceState({}, "", url);
}

let settings: {
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
	const scaleLines: Array<string> = scaleTextarea.value.split("\n");
	scaleLines.forEach((line: string) => {
		if (line.match(/^[1234567890.\s/]+$/) && !line.match(/^\s+$/)) {
			if (line.match(/\//)) {
				// ratio
				const nd: Array<string> = line.split("/");
				const ratio: number = 1200 * Math.log(parseInt(nd[0]) / parseInt(nd[1])) / Math.log(2);
				notUndefined(settings.scale).push(ratio);
			} else {
				if (line.match(/\./))
				// cents
					notUndefined(settings.scale).push(parseFloat(line));
			}
		}
	});
	settings.equivInterval = settings.scale.pop();
	settings.scale.unshift(0);
}

function parseScaleColors(): void {
	settings.keycolors = [];
	const colorsArray: Array<string> = noteColorsTextarea.value.split("\n");
	colorsArray.forEach((line: string) => notUndefined(settings.keycolors).push(line));
}

function calculateRotationMatrix(rotation: number, center: Point): Array<number> {
	let m: Array<number> = [];
	m[0] = Math.cos(rotation);
	m[1] = Math.sin(rotation);
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



class ActiveHex {
	
	public release: boolean = false;
	public freq: number = 440;
	private source: AudioBufferSourceNode|null = null;
	private gainNode: GainNode|null = null;
	
	public constructor(
		public coords: Point) {}
	
	
	public noteOn(cents: number): void {
		const freq: number = notUndefined(settings.fundamental) * Math.pow(2, cents / 1200);
		let source = notUndefined(settings.audioContext).createBufferSource(); // creates a sound source
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
		
		if (!notUndefined(settings.sampleBuffer)[sampleNumber]) // Sample not yet loaded
			return;
		
		source.buffer = notUndefined(settings.sampleBuffer)[sampleNumber] ?? null; // tell the source which sound to play
		source.playbackRate.value = freq / sampleFreq;
		// Create a gain node.
		let gainNode = notUndefined(settings.audioContext).createGain();
		// Connect the source to the gain node.
		source.connect(gainNode);
		// Connect the gain node to the destination.
		gainNode.connect(notUndefined(settings.audioContext).destination);
		source.connect(gainNode); // connect the source to the context's destination (the speakers)
		gainNode.gain.value = volume;
		source.start(0); // play the source now
		this.source = source;
		this.gainNode = gainNode;
	}
	
	
	public noteOff(): void {
		if (settings.sustain)
			notUndefined(settings.sustainedNotes).push(this);
		else {
			const fadeout: number = notUndefined(settings.audioContext).currentTime + notUndefined(settings.sampleFadeout);
			if (this.gainNode !== null) {
				this.gainNode.gain.setTargetAtTime(0, notUndefined(settings.audioContext).currentTime,
					notUndefined(settings.sampleFadeout));
			}
			if (this.source !== null) {
				// This is a terrible fudge. Please forgive me - it's late, I'm tired, I
				// have a deadline, I've got other shit to do
				this.source.stop(fadeout + 4);
			}
		}
	}
	
}



function resizeHandler(): void {
	// Resize Inner and outer coordinates of canvas to preserve aspect ratio
	
	const newWidth: number = window.innerWidth;
	const newHeight: number = window.innerHeight;
	
	let canvas = notUndefined(settings.canvas);
	canvas.style.height = newHeight + "px";
	canvas.style.width = newWidth + "px";
	
	canvas.style.marginTop = (-newHeight / 2) + "px";
	canvas.style.marginLeft = (-newWidth / 2) + "px";
	
	canvas.width = newWidth;
	canvas.height = newHeight;
	
	// Find new centerpoint
	
	const centerX: number = newWidth / 2;
	const centerY: number = newHeight / 2;
	settings.centerpoint = new Point(centerX, centerY);
	
	// Rotate about it
	
	if (settings.rotationMatrix)
		notUndefined(settings.context).restore();
	notUndefined(settings.context).save();
	
	settings.rotationMatrix = calculateRotationMatrix(-notUndefined(settings.rotation), settings.centerpoint);
	
	const m: Array<number> = calculateRotationMatrix(notUndefined(settings.rotation), settings.centerpoint);
	notUndefined(settings.context).setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
	
	// Redraw Grid
	
	drawGrid();
}

let isKeyEventAdded: boolean = false;

function back(): void {
	// Remove key listener
	window.removeEventListener("keydown", onKeyDown);
	window.removeEventListener("keyup", onKeyUp);
	isKeyEventAdded = false;
	// Stop all active notes
	while (notUndefined(settings.activeHexObjects).length > 0) {
		const coords: Point = notUndefined(settings.activeHexObjects)[0].coords;
		notUndefined(settings.activeHexObjects)[0].noteOff();
		drawHex(coords, centsToColor(hexCoordsToCents(coords), false));
		notUndefined(settings.activeHexObjects).splice(0, 1);
	}
	// UI change
	setElemVisible("keyboard", false);
	setElemVisible("backButton", false);
	setElemVisible("landing-page", true);
	document.body.style.overflow = "scroll";
}

function goKeyboard() {
	changeURL();
	
	// Set up screen
	
	setElemVisible("landing-page", false);
	setElemVisible("keyboard", true);
	document.body.style.overflow = "hidden";
	setElemVisible("backButton", true);
	
	// set up settings constants
	
	settings.fundamental = parseFloat(fundamentalInput.value);
	settings.rSteps = parseFloat(rStepsInput.value);
	settings.urSteps = settings.rSteps - parseFloat(urStepsInput.value); // Adjust to different coordinate system
	settings.hexSize = parseFloat(hexSizeInput.value);
	settings.rotation = (parseFloat(rotationInput.value) * 2 * Math.PI) / 360;
	parseScale();
	parseScaleColors();
	settings.names = namesTextarea.value.split("\n");
	settings["enum"] = enumInput.checked;
	settings.equivSteps = parseInt(equivStepsInput.value);
	
	settings.canvas = getElemById("keyboard", HTMLCanvasElement);
	const ctx = settings.canvas.getContext("2d");
	if (ctx === null)
		throw new Error("Assertion error");
	settings.context = ctx;
	
	settings.hexHeight = notUndefined(settings.hexSize) * 2;
	settings.hexVert = settings.hexHeight * 3 / 4;
	settings.hexWidth = Math.sqrt(3) / 2 * settings.hexHeight;
	
	settings.no_labels = noLabelsInput.checked;
	settings.spectrum_colors = spectrumColorsInput.checked;
	settings.fundamental_color = fundamentalColorInput.value;
	
	// Set up resize handler
	
	window.addEventListener("resize", resizeHandler, false);
	window.addEventListener("orientationchange", resizeHandler, false);
	
	//... and give it an initial call
	
	resizeHandler();
	
	// Set up synth
	
	settings.sampleBuffer = [undefined, undefined, undefined];
	const instrumentOption = instrumentSelect.selectedIndex;
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
	
	//console.log(instruments[instrumentOption]);
	
	loadSamples(instruments[instrumentOption].fileName);
	settings.sampleFadeout = instruments[instrumentOption].fade;
	
	// Set up keyboard, touch and mouse event handlers
	
	settings.sustain = false;
	settings.sustainedNotes = [];
	//settings.canvas.addEventListener("keydown", onKeyDown, false); // Firefox isn't firing :(
	//settings.canvas.addEventListener("keyup", onKeyUp, false);
	
	if (!isKeyEventAdded) {
		isKeyEventAdded = true;
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
		window.addEventListener("devicemotion", (e) => {
			x1 = e.accelerationIncludingGravity.x;
			y1 = e.accelerationIncludingGravity.y;
			z1 = e.accelerationIncludingGravity.z;
		}, false);
		
		// Periodically check the position and fire
		// if the change is greater than the sensitivity
		setInterval(() => {
			lastShakeCheck++;
			const change: number = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);
			
			if (change > sensitivity) {
				
				if (lastShakeCheck - lastShakeCount >= 3) {
					lastShakeCount = lastShakeCheck;
					
					if (settings.sustain == true) {
						settings.sustain = false;
						for (let note of notUndefined(settings.sustainedNotes))
							note.noteOff();
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
	settings.canvas.addEventListener("mousedown", (e) => {
		if (notUndefined(settings.pressedKeys).length != 0 || settings.isTouchDown)
			return;
		settings.isMouseDown = true;
		notUndefined(settings.canvas).addEventListener("mousemove", mouseActive, false);
		mouseActive(e);
	}, false);
	
	settings.canvas.addEventListener("mouseup", (e) => {
		settings.isMouseDown = false;
		if (notUndefined(settings.pressedKeys).length != 0 || settings.isTouchDown)
			return;
		notUndefined(settings.canvas).removeEventListener("mousemove", mouseActive);
		if (notUndefined(settings.activeHexObjects).length > 0) {
			const coords: Point = notUndefined(settings.activeHexObjects)[0].coords;
			notUndefined(settings.activeHexObjects)[0].noteOff();
			drawHex(coords, centsToColor(hexCoordsToCents(coords), false));
			notUndefined(settings.activeHexObjects).pop();
		}
	}, false);
	return false;
}

function onKeyDown(e: KeyboardEvent): void {
	e.preventDefault();//
	
	if (e.keyCode == 32) // Spacebar
		settings.sustain = true;
	else if (!settings.isMouseDown && !settings.isTouchDown
			&& e.keyCode in notUndefined(settings.keyCodeToCoords)
			&& notUndefined(settings.pressedKeys).indexOf(e.keyCode) == -1) {
		notUndefined(settings.pressedKeys).push(e.keyCode);
		const coords: Point = notUndefined(settings.keyCodeToCoords)[e.keyCode];
		const hex: ActiveHex = new ActiveHex(coords);
		notUndefined(settings.activeHexObjects).push(hex);
		const cents: number = hexCoordsToCents(coords);
		drawHex(coords, centsToColor(cents, true));
		hex.noteOn(cents);
	}
	
	//Hatsevich:
	else if (!settings.isMouseDown && !settings.isTouchDown
			&& e.code in codeToCoords
			&& notUndefined(settings.pressedKeys).indexOf(e.code) == -1) {
		notUndefined(settings.pressedKeys).push(e.code);
		const coords: Point = codeToCoords[e.code];
		const hex: ActiveHex = new ActiveHex(coords);
		notUndefined(settings.activeHexObjects).push(hex);
		const cents: number = hexCoordsToCents(coords);
		drawHex(coords, centsToColor(cents, true));
		hex.noteOn(cents);
	}
}

function onKeyUp(e: KeyboardEvent): void {
	if (e.keyCode == 32) { // Spacebar
		settings.sustain = false;
		for (let note of notUndefined(settings.sustainedNotes))
			note.noteOff();
		settings.sustainedNotes = [];
	} else if (!settings.isMouseDown && !settings.isTouchDown
			&& e.keyCode in notUndefined(settings.keyCodeToCoords)) {
		const keyIndex = notUndefined(settings.pressedKeys).indexOf(e.keyCode);
		if (keyIndex != -1) {
			notUndefined(settings.pressedKeys).splice(keyIndex, 1);
			const coords: Point = notUndefined(settings.keyCodeToCoords)[e.keyCode];
			drawHex(coords, centsToColor(hexCoordsToCents(coords), false));
			const hexIndex: number = notUndefined(settings.activeHexObjects).findIndex(
				(hex: ActiveHex) => coords.equals(hex.coords));
			if (hexIndex != -1) {
				notUndefined(settings.activeHexObjects)[hexIndex].noteOff();
				notUndefined(settings.activeHexObjects).splice(hexIndex, 1);
			}
		}
	}
	
	//Hatsevich:
	else if (!settings.isMouseDown && !settings.isTouchDown
			&& e.code in codeToCoords) {
		const keyIndex: number = notUndefined(settings.pressedKeys).indexOf(e.code);
		if (keyIndex != -1) {
			notUndefined(settings.pressedKeys).splice(keyIndex, 1);
			const coords: Point = codeToCoords[e.code];
			drawHex(coords, centsToColor(hexCoordsToCents(coords), false));
			const hexIndex: number = notUndefined(settings.activeHexObjects).findIndex(
				(hex: ActiveHex) => coords.equals(hex.coords));
			if (hexIndex != -1) {
				notUndefined(settings.activeHexObjects)[hexIndex].noteOff();
				notUndefined(settings.activeHexObjects).splice(hexIndex, 1);
			}
		}
	}
}

function mouseActive(e: MouseEvent): void {
	let coords: Point = getPointerPosition(e);
	
	coords = getHexCoordsAt(coords);
	
	if (notUndefined(settings.activeHexObjects).length == 0) {
		notUndefined(settings.activeHexObjects)[0] = new ActiveHex(coords);
		const cents: number = hexCoordsToCents(coords);
		notUndefined(settings.activeHexObjects)[0].noteOn(cents);
		drawHex(coords, centsToColor(cents, true));
	} else {
		if (!coords.equals(notUndefined(settings.activeHexObjects)[0].coords)) {
			notUndefined(settings.activeHexObjects)[0].noteOff();
			drawHex(notUndefined(settings.activeHexObjects)[0].coords,
				centsToColor(hexCoordsToCents(notUndefined(settings.activeHexObjects)[0].coords), false));
			
			notUndefined(settings.activeHexObjects)[0] = new ActiveHex(coords);
			const cents: number = hexCoordsToCents(coords);
			notUndefined(settings.activeHexObjects)[0].noteOn(cents);
			drawHex(coords, centsToColor(cents, true));
		}
	}
}

function getPointerPosition(e: MouseEvent): Point {
	const target = e.currentTarget;
	if (!(target instanceof HTMLElement))
		throw new TypeError();
	const parentPosition = getPosition(target);
	const xPosition: number = e.clientX - parentPosition.x;
	const yPosition: number = e.clientY - parentPosition.y;
	return new Point(xPosition, yPosition);
}

function getPosition(element: HTMLElement): {x:number, y:number} {
	let xPosition: number = 0;
	let yPosition: number = 0;
	
	while (element) {
		xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
		yPosition += element.offsetTop - element.scrollTop + element.clientTop;
		const parent = element.offsetParent;
		if (parent === null)
			break;
		if (!(parent instanceof HTMLElement))
			throw new TypeError();
		element = parent;
	}
	return {
		x: xPosition,
		y: yPosition,
	};
}

function handleTouch(e: TouchEvent): void {
	e.preventDefault();
	if (notUndefined(settings.pressedKeys).length != 0 || settings.isMouseDown) {
		settings.isTouchDown = false;
		return;
	}
	settings.isTouchDown = e.targetTouches.length != 0;
	
	for (let hex of notUndefined(settings.activeHexObjects))
		hex.release = true;
	
	for (let i = 0; i < e.targetTouches.length; i++) {
		const coords: Point = getHexCoordsAt(new Point(e.targetTouches[i].pageX - notUndefined(settings.canvas).offsetLeft,
			e.targetTouches[i].pageY - notUndefined(settings.canvas).offsetTop));
		let found: boolean = false;
		
		for (let hex of notUndefined(settings.activeHexObjects)) {
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
			notUndefined(settings.activeHexObjects).push(newHex);
		}
	}
	
	for (let i = notUndefined(settings.activeHexObjects).length - 1; i >= 0; i--) {
		if (notUndefined(settings.activeHexObjects)[i].release) {
			notUndefined(settings.activeHexObjects)[i].noteOff();
			const coords: Point = notUndefined(settings.activeHexObjects)[i].coords;
			const c: string = centsToColor(hexCoordsToCents(coords), false);
			drawHex(coords, c);
			notUndefined(settings.activeHexObjects).splice(i, 1);
		}
	}
}

function drawGrid(): void {
	let max: number = notUndefined(settings.centerpoint).x > notUndefined(settings.centerpoint).y ?
		notUndefined(settings.centerpoint).x / notUndefined(settings.hexSize) :
		notUndefined(settings.centerpoint).y / notUndefined(settings.hexSize);
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
	const screenX: number = notUndefined(settings.centerpoint).x + hex.x * notUndefined(settings.hexWidth) + hex.y * notUndefined(settings.hexWidth) / 2;
	const screenY: number = notUndefined(settings.centerpoint).y + hex.y * notUndefined(settings.hexVert);
	return new Point(screenX, screenY);
}

function drawHex(p: Point, c: string): void {
	const hexCenter: Point = hexCoordsToScreen(p);
	
	// Calculate hex vertices
	
	let x: Array<number> = [];
	let y: Array<number> = [];
	for (let i = 0; i < 6; i++) {
		const angle: number = 2 * Math.PI / 6 * (i + 0.5);
		x[i] = hexCenter.x + notUndefined(settings.hexSize) * Math.cos(angle);
		y[i] = hexCenter.y + notUndefined(settings.hexSize) * Math.sin(angle);
	}
	
	// Draw filled hex
	
	let context = notUndefined(settings.context);
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
		x2[i] = hexCenter.x + (notUndefined(settings.hexSize) + 3) * Math.cos(angle);
		y2[i] = hexCenter.y + (notUndefined(settings.hexSize) + 3) * Math.sin(angle);
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
	context.rotate(-notUndefined(settings.rotation));
	// hexcoords = p and screenCoords = hexCenter
	
	//context.fillStyle = "black"; //bdl_04062016
	context.fillStyle = getContrastYIQ(currentTextColor);
	context.font = "22pt Arial";
	context.textAlign = "center";
	context.textBaseline = "middle";
	
	const note: number = p.x * notUndefined(settings.rSteps) + p.y * notUndefined(settings.urSteps);
	const equivSteps: number = settings["enum"] ? notUndefined(settings.equivSteps) : notUndefined(settings.scale).length;
	const equivMultiple: number = Math.floor(note / equivSteps);
	let reducedNote: number = note % equivSteps;
	if (reducedNote < 0)
		reducedNote += equivSteps;
	
	if (!settings.no_labels) {
		const name: string = settings["enum"] ? "" + reducedNote : notUndefined(settings.names)[reducedNote];
		if (name) {
			context.save();
			let scaleFactor: number = name.length > 3 ? 3 / name.length : 1;
			scaleFactor *= notUndefined(settings.hexSize) / 50;
			context.scale(scaleFactor, scaleFactor);
			context.fillText(name, 0, 0);
			context.restore();
		}
		
		const scaleFactor: number = notUndefined(settings.hexSize) / 50;
		context.scale(scaleFactor, scaleFactor);
		context.translate(10, -25);
		context.fillStyle = "white";
		context.font = "12pt Arial";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText(equivMultiple.toString(), 0, 0);
	}
	
	context.restore();
}

function roundTowardZero(val: number): number {
	if (val < 0)
		return Math.ceil(val);
	return Math.floor(val);
}

function hexCoordsToCents(coords: Point): number {
	const distance: number = coords.x * notUndefined(settings.rSteps) + coords.y * notUndefined(settings.urSteps);
	let octs: number = roundTowardZero(distance / notUndefined(settings.scale).length);
	let reducedSteps = distance % notUndefined(settings.scale).length;
	if (reducedSteps < 0) {
		reducedSteps += notUndefined(settings.scale).length;
		octs -= 1;
	}
	const cents: number = octs * notUndefined(settings.equivInterval) + notUndefined(settings.scale)[reducedSteps];
	globalPressedInterval = reducedSteps;
	return cents;
}

function getHexCoordsAt(coords: Point): Point {
	coords = applyMatrixToPoint(notUndefined(settings.rotationMatrix), coords);
	const x: number = coords.x - notUndefined(settings.centerpoint).x;
	const y: number = coords.y - notUndefined(settings.centerpoint).y;
	
	let q: number = (x * Math.sqrt(3) / 3 - y / 3) / notUndefined(settings.hexSize);
	let r: number = y * 2 / 3 / notUndefined(settings.hexSize);
	
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

window.addEventListener("load", init, false);

function init(): void {
	try {
		settings.audioContext = new AudioContext();
	} catch (e) {
		alert("Web Audio API is not supported in this browser");
	}
}

async function loadSamples(name: string): Promise<void> {
	// It seems audioContext doesn't cope with simultaneous decodeAudioData calls ):
	const sampleFreqs: Array<string> = ["110", "220", "440", "880"];
	for (let i = 0; i < sampleFreqs.length; i++) {
		const url: string = `sounds/${name}${sampleFreqs[i]}.mp3`;
		const arrayBuf: ArrayBuffer = await (await fetch(url)).arrayBuffer();
		try {
			const audioBuf: AudioBuffer = await notUndefined(settings.audioContext).decodeAudioData(arrayBuf);
			notUndefined(settings.sampleBuffer)[i] = audioBuf;
		} catch (e) {
			alert("Couldn't load sample");
		}
	}
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


function checkPreset(init: number): void {
	let mselect: HTMLSelectElement = getElemById("quicklinks", HTMLSelectElement);
	const url_str: string = window.location.href;
	
	//first check for .htm as end of url and set the default preset (31ET)
	if (url_str.substring(url_str.length - 4) == ".htm")
		mselect.value = mselect.options[init].value;
	for (let i = 0; i < mselect.length; i++) {
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


//initialize keyboard on load
if (initKeyboardOnload) {
	//hide landing page
	setElemVisible("landing-page", false);
	setTimeout(() => goKeyboard(), 1500);
}
