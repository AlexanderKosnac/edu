<script>
    import { katexAsHtml, toKatexVector, toKatexMatrix } from "$lib/katexUtility.js";

    let matrixA = [
        [1, 0, 4, 2],
        [1, 2, 6, 2],
        [2, 0, 8, 8],
        [2, 1, 9, 4],
    ];
    let bA = undefined;

    let matrixB = [
        [1, 3, 1],
        [1, 1, -1],
        [3, 11, 5],
    ];
    let bB = [9, 1, 35];

    let matrix = matrixA;
    let b = bA;

    let history = [];

    let storeLabeledMatrix = (label, matrix) => {
        history.push({
            label: label,
            matrix: structuredClone(matrix),
        });
    };

    let onAugmentedMatrixCreated = storeLabeledMatrix;
    let onAfterRowSwap = storeLabeledMatrix;
    let onAfterRowElimination = storeLabeledMatrix;
    let onColumnSolved = storeLabeledMatrix;

    function gaussianElimination(matrix, b = undefined) {
        const n = matrix.length;
        const utm = b === undefined ? // Upper triangle matrix
            matrix.map(row => [...row]) :
            matrix.map((row, i) => [...row, b[i]]);

        onAugmentedMatrixCreated("Augmented matrix", utm);

        for (let k = 0; k < n; k++) {
            // Find pivot row (partial pivoting)
            let pivotRow = k;
            for (let i = k + 1; i < n; i++) {
                if (Math.abs(utm[i][k]) > Math.abs(utm[pivotRow][k])) {
                    pivotRow = i;
                }
            }

            // Swap pivot row to current row
            [utm[k], utm[pivotRow]] = [utm[pivotRow], utm[k]];
            onAfterRowSwap(`Swap row ${k} and row ${pivotRow}`, utm);

            // Eliminate rows below pivot row
            for (let i = k + 1; i < n; i++) {
                const factor = utm[i][k] / utm[k][k];
                for (let j = k; j <= n; j++) {
                    utm[i][j] -= factor * utm[k][j];
                }
                onAfterRowElimination(`Eliminate row ${i} with ${factor} * row ${k}`, utm);
            }
            onColumnSolved(`Column ${k} solved`, utm);
        }

        return utm;
    }
</script>

<svelte:head>
    <title>Gaussian elimination</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Gaussian elimination</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        Input matrix:
        {@html katexAsHtml(toKatexMatrix(matrix) + " " + (b === undefined ? "" : toKatexVector(b)))}

        Echelon form:
        {@html katexAsHtml(toKatexMatrix(gaussianElimination(matrix, b)))}
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>History</h2>
        {#each history as h}
            <div>
                {h.label}
                {@html katexAsHtml(toKatexMatrix(h.matrix))}
            </div>
        {/each}
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Gaussian_elimination" target="_blank">Gaussian elimination</a></li>
        </ul>
    </div>
</div>

<style>
</style>