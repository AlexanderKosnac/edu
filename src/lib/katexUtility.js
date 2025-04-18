export function toKatexVector(vec) {
    const arr = vec.toArray();
    return `\\begin{bmatrix}${arr.map(x => `${x}`).join('\\\\')}\\end{bmatrix}`;
}

export function toKatexMatrix(mat) {
    const rows = mat.toArray();
    const latexRows = rows.map(row => row.join(' & ')).join(' \\\\ ');
    return `\\begin{bmatrix}${latexRows}\\end{bmatrix}`;
}
