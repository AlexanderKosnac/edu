export function clamp(value, lower, upper) {
    if (value < lower) return lower;
    if (value > upper) return upper;
    return value;
}

export function sampleFunction(f, lower, upper, points) {
    const step = (upper - lower) / points;
    return Array.from({ length: points + 1 }, (_, i) => {
        const x = lower + i * step;
        return { x, y: f(x) };
    });
}

/*
 * The polynomial will be constructed in order of increasing degree:
 * c_0 + c_1 * x + c_2 * x^2 + ...
 * Meaning the coeffients have to be provided in an appropriate order.
 */
export function polynomial(x, coefficients) {
    return coefficients.reduce((sum, c, i) => sum + c * Math.pow(x, i), 0);
}

export function matMult(a, b) {
    var result = new Array(a.length).fill(0).map(_ => new Array(b[0].length).fill(0));
    return result.map((row, i) => row.map((_, j) => a[i].reduce((sum, elm, k) => sum + (elm*b[k][j]), 0)));
}
