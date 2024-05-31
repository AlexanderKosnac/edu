<script>
export let matrix;
export let center;
export let dimension;
export let factor;

function changeDimension() {
    matrix = Array.from(Array(dimension[1]), _ => Array(dimension[0]).fill(0));
}
</script>

<div class="input-group mb-1">
    <span class="input-group-text" style="width: 110px">Centerpoint</span>
    <input type="number" class="form-control" bind:value={center[0]}/>
    <input type="number" class="form-control" bind:value={center[1]}/>
</div>

<div class="input-group mb-1">
    <span class="input-group-text" style="width: 110px">Dimension</span>
    <input type="number" class="form-control" on:change={changeDimension} bind:value={dimension[0]}/>
    <input type="number" class="form-control" on:change={changeDimension} bind:value={dimension[1]}/>
</div>

<div class="input-group mb-1">
    <span class="input-group-text" style="width: 110px">Factor</span>
    <input type="number" class="form-control" bind:value={factor}/>
</div>

<div class="d-flex flex-column gap-1">
    {#each matrix as row, i}
    <div class="d-flex flex-row gap-1">
        {#each row as _, j}
            <input class="matrix-input form-control" class:centerpoint={i == center[0] && j == center[1]} type="number" bind:value={matrix[i][j]}/>
        {/each}
    </div>
    {/each}
</div>

<style>
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