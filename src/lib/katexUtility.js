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

export function toKatexVector(vec) {
    const arr = vec.toArray();
    return `\\begin{bmatrix}${arr.map(x => `${x}`).join('\\\\')}\\end{bmatrix}`;
}

export function toKatexMatrix(mat) {
    const rows = mat.toArray();
    const latexRows = rows.map(row => row.join(' & ')).join(' \\\\ ');
    return `\\begin{bmatrix}${latexRows}\\end{bmatrix}`;
}
