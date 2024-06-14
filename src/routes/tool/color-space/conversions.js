export function rgbToHsl(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const cDelta = max - min;

    let hue;
    if (cDelta == 0) {
        hue = 0;
    } else {
        switch (max) {
            case r:
                hue = ((g-b)/cDelta) % 6;
                break;
            case g:
                hue = ((b-r)/cDelta) + 2;
                break;
            case b:
                hue = ((r-g)/cDelta) + 4;
                break;
            default:
                console.error("C_max could not be determined");
        }
    }
    hue *= 60;
    if (hue < 0) hue += 360;

    const l = (max + min)/2;
    return {
        h: hue,
        s: cDelta == 0 ? 0 : cDelta/(1-Math.abs((2*l)-1))*100,
        l: l*100,
    };
}
