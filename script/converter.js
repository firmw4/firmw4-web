function hexToRgb(hex) {
    hex = hex.replace('#', '');
    let bigint = parseInt(hex, 16);
    let r = ((bigint >> 16) & 255) / 255;
    let g = ((bigint >> 8) & 255) / 255;
    let b = (bigint & 255) / 255;
    return [r, g, b];
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function convertHexToGLSL(hex) {
    const rgb = hexToRgb(hex);

    if (rgb.length !== 3) {
        showInvalidPopup('Invalid HEX color');
        return;
    }

    const vec3 = `vec3(${rgb[0].toFixed(3)}, ${rgb[1].toFixed(3)}, ${rgb[2].toFixed(3)})`;
    const vec4 = `vec4(${rgb[0].toFixed(3)}, ${rgb[1].toFixed(3)}, ${rgb[2].toFixed(3)}, 1.000)`;

    document.getElementById('result').innerHTML = `<p class="text"><code>${vec3}</code></p><p class="text"><code>${vec4}</code></p>`;
    document.getElementById('colorPreview').style.backgroundColor = hex;
    document.getElementById('colorPicker').value = hex;
}

function convertGLSLToHex(glsl) {
    const regex = /vec[34]\((\d?\.\d+), (\d?\.\d+), (\d?\.\d+)(, \d?\.\d+)?\)/;
    const match = glsl.match(regex);

    if (!match) {
        showInvalidPopup('Invalid GLSL color');
        return;
    }

    const r = Math.round(parseFloat(match[1]) * 255);
    const g = Math.round(parseFloat(match[2]) * 255);
    const b = Math.round(parseFloat(match[3]) * 255);

    const hex = rgbToHex(r, g, b);
    document.getElementById('result').innerHTML = `<p class="text"><code>${hex}</code></p>`;
    document.getElementById('colorPreview').style.backgroundColor = hex;
    document.getElementById('colorPicker').value = hex;
}

function convert() {
    const input = document.getElementById('inputField').value.trim();

    if (input.startsWith('#') && (input.length === 7 || input.length === 4)) {
        convertHexToGLSL(input);
    } else if (/vec[34]\(\d?\.\d+, \d?\.\d+, \d?\.\d+(, \d?\.\d+)?\)/.test(input)) {
        convertGLSLToHex(input);
    } else {
        showInvalidPopup('Invalid input format');
    }
}

document.getElementById('colorPicker').addEventListener('input', (event) => {
    const hex = event.target.value;
    document.getElementById('inputField').value = hex;
    convertHexToGLSL(hex);
});

function copyToClipboard() {
    const result = document.getElementById('result').innerText;
    navigator.clipboard.writeText(result).then(() => {
        alert('Copied to clipboard');
    });
}

function showInvalidPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerText = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 3000);
}