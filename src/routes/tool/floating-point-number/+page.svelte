<script>
    let nBits = 32;

    let bits = [];
    $: {
        bits = Array(nBits).fill(0);
    }

    function flipBit(idx) {
        bits[idx] = bits[idx] ? 0 : 1;
    }
</script>

<svelte:head>
    <title>Floating Point Number</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Floating Point Number</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        Number of Bits
        <input type="number" class="form-control w-auto" step="1" bind:value={nBits}>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="d-flex gap-1 overflow-auto">
            {#each bits as _, idx}
            {#if idx%8 == 0 && idx != 0}
            <div class="byte-separator"/>
            {/if}
            <button class="bit border" on:click={() => flipBit(idx)}>
                {bits[idx]}
            </button>
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Floating-point_arithmetic" target="_blank">Floating-point arithmetic</a></li>
        </ul>
    </div>
</div>

<style>
    .bit {
        width: 40px;
        height: 40px;
    }
    .byte-separator {
        width: 2px;
        background-color: var(--bs-body-color);
    }
</style>