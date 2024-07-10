<script>
import { activeKernel } from "./stores.js";

function changeDimension() {
    $activeKernel.convolution = Array.from(Array($activeKernel.dimension[1]), _ => Array($activeKernel.dimension[0]).fill(0));
}

function getKernelSum() {
    let sum = 0;
    for (let i=0; i<$activeKernel.convolution.length; i++) {
        for (let j=0; j<$activeKernel.convolution[i].length; j++) {
            sum += $activeKernel.convolution[i][j];
        }
    }
    return sum;
}

let sum, sumWithFactor;
$: {
    sum = getKernelSum();
    sumWithFactor = $activeKernel.factor * sum;
    $activeKernel.normFactor = (sumWithFactor == 0 || !$activeKernel.normalize) ? 1 : 1/sumWithFactor;
}
</script>

<div class="d-flex flex-column gap-1">
    <div class="input-group">
        <span class="input-group-text input-group-text-label">Centerpoint</span>
        <input type="number" class="form-control" bind:value={$activeKernel.center[0]}/>
        <input type="number" class="form-control" bind:value={$activeKernel.center[1]}/>
    </div>

    <div class="input-group">
        <span class="input-group-text input-group-text-label">Dimension</span>
        <input type="number" class="form-control" min="1" on:change={changeDimension} bind:value={$activeKernel.dimension[0]}/>
        <input type="number" class="form-control" min="1" on:change={changeDimension} bind:value={$activeKernel.dimension[1]}/>
    </div>

    <div class="input-group">
        <span class="input-group-text input-group-text-label">Factor</span>
        <input type="number" class="form-control" bind:value={$activeKernel.factor}/>
    </div>

    <div class="d-flex flex-row gap-3">
        {#if $activeKernel.convolution}
        <div class="d-flex flex-row gap-1">
            {#each $activeKernel.convolution as row, i}
            <div class="d-flex flex-column gap-1">
                {#each row as _, j}
                    <input type="number" class="matrix-input form-control"
                        class:centerpoint={i == $activeKernel.center[0] && j == $activeKernel.center[1]}
                        bind:value={$activeKernel.convolution[i][j]}/>
                {/each}
            </div>
            {/each}
        </div>
        {/if}

        <div>
            <span class="fw-bold">Matrix Sum:</span> {sum}<br>
            <span class="fw-bold">Matrix Sum with Factor:</span> {sumWithFactor}
        </div>
    </div>

    <div class="form-check">
        <label class="form-check-label">
            <input class="form-check-input" type="checkbox" value="" bind:checked={$activeKernel.normalize}>
            Normalize to a kernel sum of 1
            {#if $activeKernel.normalize && sumWithFactor != 0}
                (Factor: 1/{sumWithFactor} = {$activeKernel.normFactor.toFixed(5)})
            {/if}
            {#if sumWithFactor == 0}
                (Sum is 0, can't normalize.)
            {/if}
        </label>
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
        border-color: #0d6efd;
    }
</style>