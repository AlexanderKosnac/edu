<script>
    let inputAscii = "Hamming";

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
        charsAsBinaryDumpLines()
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
    </div>
</div>

<div class="row">
    <div class="col">

    </div>

    <div class="col">
        <h3>Input as Binary Data:</h3>
        <pre>{#each charsAsBinaryDumpLines(inputAscii) as bitsString}<span class="font-monospace">{bitsString}</span><br>{/each}</pre>
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