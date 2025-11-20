<script>
    import { katexAsHtml, toKatexVector, toKatexMatrix } from "$lib/katexUtility.js";

    let matrixN = [
        [ 0,  4, -2, -3],
        [-2, -6,  3,  1],
        [ 3,  7,  4, -1],
        [ 1,  3,  0, -2],
    ];
    let bN = [1, 2, 3, 2];

    let matrix = matrixN;
    let b = undefined;

    $: solution = gaussianElimination(matrix, b)

    let history = [];

    let storeLabeledMatrix = (label, matrix) => {
        history.push({
            label: label,
            matrix: structuredClone(matrix),
        });
    };

    let onAfterRowSwap = storeLabeledMatrix;
    let onAfterRowElimination = storeLabeledMatrix;
    let onColumnSolved = storeLabeledMatrix;

    function gaussianElimination(A, b = undefined) {
        const n = A.length;

        if (b) { // Augment A by b
            for (let i = 0; i < n; i++) {
                A[i] = [...A[i], b[i]];
            }
        }

        for (let i = 0; i < n; i++) {
            // Pivoting
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
                    maxRow = k;
                }
            }
            [A[i], A[maxRow]] = [A[maxRow], A[i]];
            if (i != maxRow)
                onAfterRowSwap(`Swapped ${maxRow} -> ${i}.`, A);

            // 0 pivot, thus unsolvable.
            if (Math.abs(A[i][i]) < 1e-12)
                throw new Error("Matrix is singular or nearly singular.");

            // Eliminate rows below pivot.
            for (let k = i + 1; k < n; k++) {
                let factor = A[k][i] / A[i][i];
                for (let j = i; j < (b ? n + 1 : n); j++) {
                    A[k][j] -= factor * A[i][j];
                }
                onAfterRowElimination(`Eliminate row ${k} by ${factor} * row ${i}.`, A);
            }
            onColumnSolved(`Column ${i} solved.`, A);
        }

        return { A, b };
    }

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

{solution.A}
{solution.b}

<div class="row">
    <div class="col">
        Input matrix:
        {@html katexAsHtml(toKatexMatrix(matrix) + " " + (b === undefined ? "" : toKatexVector(b)))}

        Echelon form:
        {@html katexAsHtml(toKatexMatrix(solution.A))}
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