export function getContrastingColor(bgColor) {
    let r = parseInt(bgColor.substr(1, 2), 16) / 255;
    let g = parseInt(bgColor.substr(3, 2), 16) / 255;
    let b = parseInt(bgColor.substr(5, 2), 16) / 255;

    [r, g, b] = [r, g, b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

    let lb = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return (lb > 0.179) ? "#000000" : "#FFFFFF";
}
