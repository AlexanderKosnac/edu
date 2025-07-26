<script>
    let explicitMapping = {
         0: "NUL",  1: "SOH",  2: "STX",  3: "ETX",  4: "EOT",  5: "ENQ",  6: "ACK",  7: "BEL",
         8: "BS",   9: "HT",  10: "LF",  11: "VT",  12: "FF",  13: "CR",  14: "SO",  15: "SI",
        16: "DLE", 17: "DC1", 18: "DC2", 19: "DC3", 20: "DC4", 21: "NAK", 22: "SYN", 23: "ETB",
        24: "CAN", 25: "EM",  26: "SUB", 27: "ESC", 28: "FS",  29: "GS",  30: "RS",  31: "US",
        32: "SP",
        127: "DEL",
    };
</script>

<svelte:head>
    <title>ASCII</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>ASCII</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <table class="table table-bordered w-auto mt-1">
            <thead>
                <tr>
                    <th></th>
                    {#each { length: 16 } as _, i}
                        <th>{i.toString(16).toUpperCase()}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each { length: 8 } as _, i}
                <tr>
                    <th>{i.toString(16).toUpperCase()}</th>
                    {#each { length: 16 } as _, j}
                    	{@const idx = i * 16 + j}
                        {#if explicitMapping[idx]}
                            <td><kbd>{explicitMapping[idx]}</kbd></td>
                        {:else}
                            <td>{String.fromCharCode(idx)}</td>
                        {/if}
                    {/each}
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/ASCII" target="_blank">ASCII</a></li>
        </ul>
    </div>
</div>

<style>
</style>