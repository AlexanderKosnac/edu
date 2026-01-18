<script>
    import { katexAsHtml, toKatexVector, toKatexMatrix } from "$lib/katexUtility.js";

    let matrixN = [
        [  4,  12, -16],
        [ 12,  37, -43],
        [-16, -43,  98],
    ];

    let matrix = matrixN;

    let solutionLLT = choleskyDecompositionLLT(matrix);
    let solutionLDLT = choleskyDecompositionLDLT(matrix);

    function choleskyDecompositionLLT(A) {
        const n = A.length;
        const L = Array.from({ length: n }, () => Array(n).fill(0));

        for (let i = 0; i < n; i++) {
            // Diagonal
            let sum = A[i][i];
            for (let k = 0; k < i; k++) {
                sum -= L[i][k] * L[i][k];
            }
            if (sum <= 0)
                throw new Error("Matrix is not symmetric positive-definite.");
            L[i][i] = Math.sqrt(sum);

            // Off-diagonal
            for (let j = i + 1; j < n; j++) {
                let sum2 = A[j][i];
                for (let k = 0; k < i; k++) {
                    sum2 -= L[j][k] * L[i][k];
                }
                L[j][i] = sum2 / L[i][i];
            }
        }
        return L;
    }

    function choleskyDecompositionLDLT(A) {
        const n = A.length;
        const L = Array.from({ length: n }, () => Array(n).fill(0));
        const D = Array(n).fill(0);

        for (let i = 0; i < n; i++) {
            // Diagonal
            let sum = A[i][i];
            for (let k = 0; k < i; k++) {
                sum -= L[i][k] * L[i][k] * D[k];
            }
            D[i] = sum;

            if (D[i] === 0) {
                throw new Error("Matrix is not positive definite.");
            }

            // Off-diagonal, with diagonal 1
            L[i][i] = 1;
            for (let j = i + 1; j < n; j++) {
                let sum2 = A[j][i];
                for (let k = 0; k < i; k++) {
                    sum2 -= L[j][k] * L[i][k] * D[k];
                }
                L[j][i] = sum2 / D[i];
            }
        }

        return { L, D: vectorToDiagonalMatrix(D) };
    }

    function conjugateTranspose(A) {
        return A[0].map((_, i) => A.map(row => row[i]));
    }

    function vectorToDiagonalMatrix(arr) {
        return arr.map((val, i) =>
            arr.map((_, j) => (i === j ? val : 0))
        );
    }
</script>

<div class="row">
    <div class="col">
        Input matrix:
        {@html katexAsHtml(toKatexMatrix(matrix))}
    </div>
</div>

<div class="row">
    <div class="col">
        Decompositions:
        {@html katexAsHtml("LL^T="+ toKatexMatrix(solutionLLT) + " " + toKatexMatrix(conjugateTranspose(solutionLLT)))}
        {@html katexAsHtml("LDL^T="+ toKatexMatrix(solutionLDLT.L) + " " + toKatexMatrix(solutionLDLT.D) + " " + toKatexMatrix(conjugateTranspose(solutionLDLT.L)))}
    </div>
</div>

<style>
</style>