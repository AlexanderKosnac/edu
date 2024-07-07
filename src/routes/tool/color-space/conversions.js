export function asHexTwoDig(n) {
    return n.toString(16).padStart(2, "0").toUpperCase();
}

export function rgbAsHex(rgb) {
    return `#${asHexTwoDig(rgb.r)}${asHexTwoDig(rgb.g)}${asHexTwoDig(rgb.b)}`;
}

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

export function hslToRgb(hsl) {
    const ll = hsl.l/100;
    const ss = hsl.s/100;

    const c = (1-Math.abs(2*ll-1) * ss);
    const x = c * (1-Math.abs((hsl.h/60)%2-1));
    const m = ll - c/2;

    function hueRange60(start) {
        return start <= hsl.h && hsl.h < (start+60);
    }

    let tuple;
    if (hueRange60(0)) {
        tuple = [c, x, 0];
    } else if (hueRange60(60)) {
        tuple = [x, c, 0];
    } else if (hueRange60(120)) {
        tuple = [0, c, x];
    } else if (hueRange60(180)) {
        tuple = [0, x , c];
    } else if (hueRange60(240)) {
        tuple = [x, 0, c];
    } else if (hueRange60(300)) {
        tuple = [c, 0, x];
    } else {
        console.error(`Hue ${hsl.h} is out of range [0; 360]`);
    }
    return {
        r: Math.floor((tuple[0]+m) * 255),
        g: Math.floor((tuple[1]+m) * 255),
        b: Math.floor((tuple[2]+m) * 255),
    }
}
