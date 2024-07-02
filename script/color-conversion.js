function hexToRgb(hex) {
    hex = hex.replace('#', '');
    let bigint = parseInt(hex, 16);
    let r = ((bigint >> 16) & 255);
    let g = ((bigint >> 8) & 255);
    let b = (bigint & 255);
    return [r, g, b];
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, v * 100];
}

function hsvToRgb(h, s, v) {
    h /= 360;
    s /= 100;
    v /= 100;

    let r, g, b;

    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function convertHexToGLSL(hex) {
    const rgb = hexToRgb(hex);

    if (rgb.length !== 3) {
        showInvalidMessage('Invalid HEX color');
        return;
    }

    const vec3 = `vec3(${(rgb[0] / 255).toFixed(3)}, ${(rgb[1] / 255).toFixed(3)}, ${(rgb[2] / 255).toFixed(3)})`;
    const rgbString = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    const hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    const hsvString = `hsv(${hsv[0].toFixed(0)}°, ${hsv[1].toFixed(0)}%, ${hsv[2].toFixed(0)}%)`;

    document.getElementById('result').innerHTML = `
        <p onclick="copyToClipboard('hex')"><code id="hex">${hex}</code></p>
        <p onclick="copyToClipboard('vec3')"><code id="vec3">${vec3}</code></p>
        <p onclick="copyToClipboard('rgb')"><code id="rgb">${rgbString}</code></p>
        <p onclick="copyToClipboard('hsv')"><code id="hsv">${hsvString}</code></p>
    `;
    document.getElementById('colorPreview').style.backgroundColor = hex;
    document.getElementById('colorPicker').value = hex;
}

function convertRgbToGLSL(rgbString) {
    const rgb = rgbString.match(/\d+/g).map(Number);

    if (rgb.length !== 3 || rgb.some((val) => val < 0 || val > 255)) {
        showInvalidMessage('Invalid RGB color');
        return;
    }

    const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    convertHexToGLSL(hex);
}

function convertHsvToGLSL(hsvString) {
    const hsv = hsvString.match(/\d+(\.\d+)?/g).map(Number);

    if (hsv.length !== 3 || hsv[0] < 0 || hsv[0] > 360 || hsv[1] < 0 || hsv[1] > 100 || hsv[2] < 0 || hsv[2] > 100) {
        showInvalidMessage('Invalid HSV color');
        return;
    }

    const rgb = hsvToRgb(hsv[0], hsv[1], hsv[2]);
    const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    convertHexToGLSL(hex);
}

function convertGLSLToHex(glsl) {
    const regex = /vec[34]\((\d?\.\d+), (\d?\.\d+), (\d?\.\d+)(, \d?\.\d+)?\)/;
    const match = glsl.match(regex);

    if (!match) {
        showInvalidMessage('Invalid GLSL color');
        return;
    }

    const r = Math.round(parseFloat(match[1]) * 255);
    const g = Math.round(parseFloat(match[2]) * 255);
    const b = Math.round(parseFloat(match[3]) * 255);

    const hex = rgbToHex(r, g, b);
    convertHexToGLSL(hex);
}

function convert() {
    const input = document.getElementById('inputField').value.trim();

    if (input.startsWith('#') && (input.length === 7 || input.length === 4)) {
        convertHexToGLSL(input);
    } else if (/vec[34]\(\d?\.\d+, \d?\.\d+, \d?\.\d+(, \d?\.\d+)?\)/.test(input)) {
        convertGLSLToHex(input);
    } else if (/^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/.test(input)) {
        convertRgbToGLSL(input);
    } else if (/^hsv\((\d{1,3})°, (\d{1,3})%, (\d{1,3})%\)$/.test(input)) {
        convertHsvToGLSL(input);
    } else {
        showInvalidMessage('Invalid input format');
    }
}

document.getElementById('colorPicker').addEventListener('input', (event) => {
    const hex = event.target.value;
    document.getElementById('inputField').value = hex;
    convertHexToGLSL(hex);
});

document.getElementById('inputField').addEventListener('input', () => {
    convert();
});

function copyToClipboard(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert(`Copied ${id} to clipboard`);
    });
}

function showInvalidMessage(message) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `<p>${message}</p>`;
}