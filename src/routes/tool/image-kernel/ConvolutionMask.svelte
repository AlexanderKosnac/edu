<script>
export let matrix;
export let center;
export let dimension;
export let factor;
export let normalization;

let normalize = true;

function changeDimension() {
    matrix = Array.from(Array(dimension[1]), _ => Array(dimension[0]).fill(0));
}

function sumMatrix(array) {
    let sum = 0;
    for (let i=0; i<array.length; i++) {
        for (let j=0; j<array[i].length; j++) {
            sum += array[i][j];
        }
    }
    return sum;
}

$: sum = sumMatrix(matrix);
$: normalization = (sum == 0 || !normalize) ? 1 : 1/sum;
</script>

<div class="d-flex flex-column gap-1">
    <div class="input-group">
        <span class="input-group-text input-group-text-label">Centerpoint</span>
        <input type="number" class="form-control" bind:value={center[0]}/>
        <input type="number" class="form-control" bind:value={center[1]}/>
    </div>

    <div class="input-group">
        <span class="input-group-text input-group-text-label">Dimension</span>
        <input type="number" class="form-control" on:change={changeDimension} bind:value={dimension[0]}/>
        <input type="number" class="form-control" on:change={changeDimension} bind:value={dimension[1]}/>
    </div>

    <div class="input-group">
        <span class="input-group-text input-group-text-label">Factor</span>
        <input type="number" class="form-control" bind:value={factor}/>
    </div>

    <div class="form-check">
        <label class="form-check-label">
            <input class="form-check-input" type="checkbox" value="" bind:checked={normalize}>
            Normalize over matrix sum.
            {#if normalize && sum != 0}
                (Factor: 1/{sum} = {normalization.toFixed(5)})
            {/if}
            {#if sum == 0}
                (Sum is 0, can't normalize.)
            {/if}
        </label>
    </div>

    <div class="d-flex flex-row gap-3">
        <div class="d-flex flex-column gap-1">
            {#each matrix as row, i}
            <div class="d-flex flex-row gap-1">
                {#each row as _, j}
                    <input class="matrix-input form-control" class:centerpoint={i == center[0] && j == center[1]} type="number" bind:value={matrix[j][i]}/>
                {/each}
            </div>
            {/each}
        </div>
    
        <div>
            <span class="fw-bold">Matrix Sum: </span>{sum}
        </div>
    </div>
</div>

<style>
    .input-group-text-label {
        width: 110px;
    }

    .matrix-input {
        text-align: center;
        width: 50px;
        height: 50px;
    }

    input[type="number"].matrix-input {
        -moz-appearance: textfield;
    }

    input[type="number"].matrix-input::-webkit-outer-spin-button,
    input[type="number"].matrix-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    .centerpoint {
        border-color: red;
    }
</style>