<script>
    let input = "1234";
    let base = 10;

    let error = "";
    let results = null;

    const MAX_SAFE = Number.MAX_SAFE_INTEGER;

    $: {
        const num = parseInt(input, base);
        if (isNaN(num)) {
            error = "Invalid number";
            results = null;
        } else if (num > MAX_SAFE) {
            error = `Value exceeds safe integer limit (${MAX_SAFE})`;
            results = null;
        } else {
            error = "";
            results = Array.from({ length: 36 - 2 + 1 }, (_, i) => i + 2).map(x => num.toString(x).toUpperCase());
        }
    }
</script>

<svelte:head>
    <title>base-x</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>base-x</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <div class="d-flex gap-1">
            <label>
                Number:
                <input type="text" class="form-control" bind:value={input}/>
            </label>
            <label>
                Base:
                <input type="number" class="form-control" bind:value={base} min="2" max="36"/>
            </label>
        </div>
    </div>

    <div class="col">
        {#if results}
        <div class="d-flex flex-row gap-3">
            {#each { length: 4 } as _, i}
            <table class="table table-bordered w-auto mt-1">
                <thead>
                    <tr>
                        <th>System</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {#each { length: 10 } as _, j}
                    {@const idx = i*10+j}
                    <tr>
                        <td>{idx}</td>
                        <td>
                            {#if idx >= 2}
                                <tt>{results[idx-2]}</tt>
                            {:else}
                                -
                            {/if}
                        </td>
                    </tr>
                    {/each}
                </tbody>
            </table>
            {/each}
        </div>
        {:else if error}
            <div class="text-danger mt-2">Error: {error}</div>
        {/if}
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Numeral_system" target="_blank">Numeral system</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Hexadecimal" target="_blank">Hexadecimal</a></li>
        </ul>
    </div>
</div>

<style>
</style>