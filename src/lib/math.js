export function clamp(value, lower, upper) {
    if (value < lower) return lower;
    if (value > upper) return upper;
    return value;
}

export function matMult(a, b) {
    var result = new Array(a.length).fill(0).map(_ => new Array(b[0].length).fill(0));
    return result.map((row, i) => row.map((_, j) => a[i].reduce((sum, elm, k) => sum + (elm*b[k][j]), 0)));
}
