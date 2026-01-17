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

    function changeBase() {
        input = parseInt(input, base).toString(base);
    }

    function increment() {
        let num = parseInt(input, base);
        num++;
        input = num.toString(base);
    }

    function decrement() {
        let num = parseInt(input, base);
        num--;
        input = num.toString(base);
    }
</script>

<div class="row">
    <div class="col-auto">
        <div class="input-group">
            <span class="input-group-text">Number</span>
            <input type="text" class="form-control" bind:value={input}/>
            <button type="button" class="btn btn-secondary" onclick={decrement}>-1</button>
            <button type="button" class="btn btn-secondary" onclick={increment}>+1</button>
            <span class="input-group-text">Base</span>
            <input type="number" class="form-control" bind:value={base} min="2" max="36" onchange={changeBase}/>
        </div>
    </div>
</div>

<div class="row">
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