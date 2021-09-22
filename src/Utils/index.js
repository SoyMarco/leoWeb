export const formatFunc = (e) => {
	let value = e.toString();
	if (value && typeof value === "string") {
		let format = "";
		let decimal = value.indexOf(".");

		if (decimal > 0) {
			let a = new RegExp(/(^([0-9]*\.[0-9][0-9])$)/gi);
			let onlyTwoDecimals = value.match(a, "$1");

			if (!onlyTwoDecimals) {
				let splitDecimals = value.split(".");
				if (splitDecimals[1]) {
					let sub = splitDecimals[1].substring(0, 2);
					value = `${splitDecimals[0]}.${sub}`;
				}
			}
			if (value.length <= 10) {
				format = `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			} else {
				let val = value.substring(0, 10);
				format = `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
		} else {
			if (value.length <= 6) {
				format = `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			} else {
				let val = value.substring(0, 6);
				format = `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
		}
		return format;
	}
};

export const parserFunc = (value) => {
	let clean = value.replace(/\$\s?|(,*)/g, "");
	if (clean && clean.length > 3) {
		let result = "";
		let decimal = clean.indexOf(".");
		if (decimal > 0 && clean.length <= 7) {
			result = clean.substring(0, 7);
		} else {
			result = clean.substring(0, 3);
		}

		return result;
	} else {
		return clean;
	}
};

export const keyBlock = (e) => {
	if (e.shiftKey || (e.shiftKey && e.which === 51) || e.key === "Dead") {
		e.preventDefault();
	}
	if (
		e.keyCode === 27 ||
		e.keyCode === 69 ||
		e.keyCode === 73 ||
		e.keyCode === 186 ||
		e.keyCode === 187 ||
		e.keyCode === 189 ||
		e.keyCode === 40 ||
		e.keyCode === 107 ||
		e.keyCode === 109 ||
		e.keyCode === 112 ||
		e.keyCode === 113 ||
		e.keyCode === 114 ||
		e.keyCode === 117 ||
		e.keyCode === 118 ||
		e.keyCode === 119 ||
		e.keyCode === 120 ||
		e.keyCode === 121 ||
		e.keyCode === 122 ||
		e.keyCode === 123 ||
		e.keyCode === 191 ||
		e.keyCode === 192 ||
		e.keyCode === 219 ||
		e.keyCode === 220 ||
		e.keyCode === 221 ||
		e.keyCode === 222 ||
		e.keyCode === 38 ||
		e.keyCode === 40 ||
		e.key === "{" ||
		e.key === "}" ||
		e.key === "+" ||
		e.key === "*" ||
		e.key === "[" ||
		e.key === "]" ||
		e.key === "´" ||
		e.key === "/" ||
		e.key === "<" ||
		e.key === "+" ||
		e.key === "´´" ||
		e.key === "ArrowLeft" ||
		e.key === "BracketLeft" ||
		e.key === "BracketRight" ||
		e.key === "Quote" ||
		e.key === "Shift" ||
		e.key === "Dead" ||
		(e.keyCode >= 65 && e.keyCode <= 90) ||
		e.shiftKey ||
		e.key === "ArrowDown" ||
		e.key === "ArrowUp"
	) {
		e.preventDefault();
	}
};

export const keyBlockFs = (e) => {
	if (e.shiftKey || (e.shiftKey && e.which === 51) || e.key === "Dead") {
		e.preventDefault();
	}
	if (
		e.keyCode === 112 ||
		e.keyCode === 113 ||
		e.keyCode === 114 ||
		e.keyCode === 117 ||
		e.keyCode === 118 ||
		e.keyCode === 119 ||
		e.keyCode === 120 ||
		e.keyCode === 121 ||
		e.keyCode === 122 ||
		e.keyCode === 123
	) {
		e.preventDefault();
	}
};
