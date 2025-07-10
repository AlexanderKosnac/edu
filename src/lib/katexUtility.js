import * as katex from "katex";
import "katex/dist/katex.min.css";

export function katexAsHtml(input) {
    return katex.renderToString(input, {
        displayMode: true,
        throwOnError: false,
    });
}

export function katexAsHtmlInline(input) {
    return katex.renderToString(input, {
        throwOnError: false,
    });
}

export function toKatexVector(arr) {
    return `\\begin{bmatrix}${arr.map(x => `${x}`).join('\\\\')}\\end{bmatrix}`;
}

export function toKatexMatrix(arr) {
    return `\\begin{bmatrix}${arr.map(row => row.join(' & ')).join(' \\\\ ')}\\end{bmatrix}`;
}
