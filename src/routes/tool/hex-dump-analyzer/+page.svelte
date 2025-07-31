<script>
    import { hexStringToByteArray } from "$lib/hexUtility";

    let hexInput = "48656c6c6f";

    let sanitizedHexInput;
    let data;
    $: {
        sanitizedHexInput = hexInput.replace(/[^0-9a-fA-F]/g, '');
        data = hexStringToByteArray(sanitizedHexInput);
    }
</script>

<svelte:head>
    <title>Hex Dump Analyzer</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Hex Dump Analyzer</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="form-group">
            <label for="hexInput">Hex String:</label>
            <input type="text" id="hexInput" class="form-control" bind:value={hexInput}/>
        </div>
        <div class="form-group">
            <label for="sanitizedHexInput">Sanitized Hex String:</label>
            <input type="text" id="sanitizedHexInput" class="form-control" value={sanitizedHexInput}/>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Hex_dump" target="_blank">Hex dump</a></li>
        </ul>
    </div>
</div>

<style>
</style>