export const POINT_2D = [
    [fieldStatic("x")],
    [fieldStatic("y")],
];

export const POINT_2D_AFFINE = [
    [fieldStatic("x")],
    [fieldStatic("y")],
    [fieldStatic("1")],
];

export function fieldStatic(value, fnEval) {
    return {
        value: value,
        editable: false,
        displayPrefix: undefined,
        displaySuffix: undefined,
        fnEval: fnEval,
    }
}

export function field(value, editable, displayPrefix, displaySuffix, fnEval) {
    return {
        value: value,
        editable: editable,
        displayPrefix: displayPrefix,
        displaySuffix: displaySuffix,
        fnEval: fnEval ?? val,
    }
}

export function val() {
    return parseFloat(this.value);
}

export function asCos() {
    return Math.cos(parseFloat(this.value));
}

export function asSin() {
    return Math.sin(parseFloat(this.value));
}

export function asNegSin() {
    return -Math.sin(parseFloat(this.value));
}