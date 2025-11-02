export function getContrastingColor(bgColor) {
    let r = parseInt(bgColor.substr(1, 2), 16) / 255;
    let g = parseInt(bgColor.substr(3, 2), 16) / 255;
    let b = parseInt(bgColor.substr(5, 2), 16) / 255;

    [r, g, b] = [r, g, b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

    let lb = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return (lb > 0.179) ? "#000000" : "#FFFFFF";
}

export function getRandomColor() {
    return `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`;
}

export function getEvenlySpacedColorsHsl(n) {
    const colors = [];
    for (let i = 0; i < n; i++) {
        const hue = Math.round((360 / n) * i);
        colors.push(`hsl(${hue}, 100%, 50%)`);
    }
    return colors;
}

export function getEvenlySpacedColorsHex(n) {
    const colors = [];
    for (let i = 0; i < n; i++) {
        const hue = (i * 360) / n;
        const rgb = hslToRgb(hue / 360, 1.0, 0.5);
        colors.push(rgbToHex(...rgb));
    }
    return colors;
}

export function generateHighContrastColorsHex(n) {
    const colors = [];
    const goldenRatio = 137.508; // For good hue distribution
    let hue = 0;
    for (let i = 0; i < n; i++) {
        hue = (hue + goldenRatio) % 360;
        const rgb = hslToRgb(hue / 360, 1.0, 0.5);
        colors.push(rgbToHex(...rgb));
    }
    return colors;
}

function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [r * 255, g * 255, b * 255];
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, "0")).join("");
}
