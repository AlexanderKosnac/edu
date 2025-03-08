<script>
    let inputAscii = "Hamming";
    let inputBlockSize = 11;

    function charsAsBinaryDumpLines(input) {
        const padding = `${input.length}`.length;
        return input.split("").map((c, i) => `${i.toString().padStart(padding, " ")}  ${c.charCodeAt(0).toString(2).padStart(8, "0")}  ${c}`);
    }

    function charsAsBinaryList(input) {
        return Array.from(input).flatMap(c => byteAsBinaryList(c.charCodeAt(0)));
    }

    function byteAsBinaryList(byte) {
        return byte.toString(2).padStart(8, "0").split("").map(bit => Number(bit));
    }

    function onInputChanged() {
    }
</script>

<svelte:head>
    <title>Hamming Codes</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Hamming Codes</h1>
    </div>
</div>

<div class="row mb-1">
    <div class="col">
        <label for="asciiInput">ASCII Input:</label>
        <input type="text" id="asciiInput" class="form-control font-monospace" bind:value="{inputAscii}" on:input={onInputChanged}/>

        <label for="blockSize">Block Size:</label>
        <input type="number" id="blockSize" class="form-control" bind:value="{inputBlockSize}"/>
    </div>
</div>

<div class="row">
    <div class="col">
        {#each charsAsBinaryDumpLines(inputAscii) as bits}
            <span class="font-monospace">{bits}</span><br>
        {/each}
    </div>
    <div class="col">
        {#each charsAsBinaryList(inputAscii) as bit}
            <span class="font-monospace">{bit} </span>
        {/each}
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="mw-100 overflow-auto">
            <table class="table table-bordered w-auto">
                <tbody>
                    <tr>
                        <th>Index</th>
                        {#each charsAsBinaryList(inputAscii) as _, i}
                            <td><strong>{i}</strong></td>
                        {/each}
                    </tr>
                    <tr>
                        <th>Value</th>
                        {#each charsAsBinaryList(inputAscii) as bit}
                            <td><span class="font-monospace">{bit}</span></td>
                        {/each}
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Hamming_code" target="_blank">Hamming Codes on Wikipedia</a></li>
        </ul>
    </div>
</div>

<style>
</style>