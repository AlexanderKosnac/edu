<script>
    import { katexAsHtml, toKatexVector, toKatexMatrix } from "$lib/katexUtility.js";

    let matrixN = [
        [  4,  12, -16],
        [ 12,  37, -43],
        [-16, -43,  98],
    ];

    let matrix = matrixN;

    let solution = choleskyDecompositionLLT(matrix);

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

    function conjugateTranspose(A) {
        return A[0].map((_, i) => A.map(row => row[i]));
    }
</script>

<svelte:head>
    <title>Cholseky decomposition</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Cholseky decomposition</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        Input matrix:
        {@html katexAsHtml(toKatexMatrix(matrix))}
    </div>
</div>

<div class="row">
    <div class="col">
        {@html katexAsHtml("LL^T="+ toKatexMatrix(solution) + " " + toKatexMatrix(conjugateTranspose(solution)))}
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Cholesky_decomposition" target="_blank">Cholseky decomposition</a></li>
        </ul>
    </div>
</div>

<style>
</style>