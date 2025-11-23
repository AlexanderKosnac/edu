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
    let b = bN;

    $: solution = gaussianEliminationAndSolve(matrix, b)

    let history = [];

    let storeLabeledMatrix = (label, matrix) => {
        history.push({
            label: label,
            matrix: structuredClone(matrix),
        });
    };

    function splitAugmentedMatrix(augmented) {
        if (!augmented.length)
            return { A: [], b: [] };

        const n = augmented[0].length - 1;
        return {
            A: augmented.map(row => row.slice(0, n)),
            b: augmented.map(row => row[n]),
        };
    }

    let onAfterRowSwap = storeLabeledMatrix;
    let onAfterRowElimination = storeLabeledMatrix;
    let onColumnSolved = storeLabeledMatrix;

    function gaussianEliminationAndSolve(A, b = undefined) {
        let s = gaussianElimination(A, b);
        console.log(s);
        return {
            UT: s.UT, b: s.b,
            x: s.b === undefined ? undefined : backSubstitution(s.UT, s.b),
        };
    }

    function gaussianElimination(A, b = undefined) {
        let UT = structuredClone(A);
        let b2 = structuredClone(b);
        const n = UT.length;

        if (b2) { // Augment A by b
            for (let i = 0; i < n; i++) {
                UT[i] = [...UT[i], b2[i]];
            }
        }

        for (let i = 0; i < n; i++) {
            // Pivoting
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(UT[k][i]) > Math.abs(UT[maxRow][i])) {
                    maxRow = k;
                }
            }
            [UT[i], UT[maxRow]] = [UT[maxRow], UT[i]];
            if (i != maxRow)
                onAfterRowSwap(`Swapped ${maxRow} -> ${i}.`, UT);

            // 0 pivot, thus unsolvable.
            if (Math.abs(UT[i][i]) < 1e-12)
                throw new Error("Matrix is singular or nearly singular.");

            // Eliminate rows below pivot.
            for (let k = i + 1; k < n; k++) {
                let factor = UT[k][i] / UT[i][i];
                for (let j = i; j < (b2 ? n + 1 : n); j++) {
                    UT[k][j] -= factor * UT[i][j];
                }
                onAfterRowElimination(`Eliminate row ${k} by ${factor} * row ${i}.`, UT);
            }
            onColumnSolved(`Column ${i} solved.`, UT);
        }

        if (b2) {
            let m = splitAugmentedMatrix(UT)
            return { UT: m.A, b: m.b };
        } else {
            return { UT, b: undefined };
        }
    }

    function backSubstitution(UT, b) {
        const n = UT.length;
        const x = new Array(n).fill(0);

        for (let i = n - 1; i >= 0; i--) {
            let sum = b[i];
            for (let j = i + 1; j < n; j++) {
                sum -= UT[i][j] * x[j];
            }
            x[i] = sum / UT[i][i];
        }

        return x;
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

        {#if solution}
            Echelon form:
            {@html katexAsHtml(toKatexMatrix(solution.UT) + " " + (solution.b === undefined ? "" : toKatexVector(solution.b)))}
        {/if}

        {#if solution.b}
            Solution vector:
            {@html katexAsHtml(`${backSubstitution(solution.UT, solution.b)}`)}
        {/if}
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