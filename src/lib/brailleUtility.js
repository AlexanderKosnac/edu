export function imageDataToBraille(imageData, threshold = 128, brightnessCoefficients = [0.299, 0.587, 0.114]) {
    let data = imageData.data;
    let width = imageData.width;
    let height = imageData.height;
    const dotMap = [
        [0x01, 0x08],
        [0x02, 0x10],
        [0x04, 0x20],
        [0x40, 0x80],
    ];
    let output = "";

    for (let y = 0; y < height; y += 4) {
        for (let x = 0; x < width; x += 2) {
            let bits = 0;
            for (let dy = 0; dy < 4; dy++) {
                for (let dx = 0; dx < 2; dx++) {
                    const px = x + dx;
                    const py = y + dy;
                    if (px >= width || py >= height)
                        continue;

                    const i = (py * width + px) * 4;
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const c = brightnessCoefficients;
                    const brightness = c[0] * r + c[1] * g + c[2] * b;

                    if (brightness < threshold)
                        bits |= dotMap[dy][dx];
                }
            }
            output += String.fromCharCode(0x2800 + bits);
        }
        output += "\n";
    }

    return output;
}
