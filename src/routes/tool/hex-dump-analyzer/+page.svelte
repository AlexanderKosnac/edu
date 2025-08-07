<script>
    import { hexStringToByteArray } from "$lib/hexUtility";

    let hexInput = "48656c6c6f";

    let sanitizedHexInput, hexDumpString;

    function onDataChange() {
        sanitizedHexInput = hexInput.replace(/[^0-9a-fA-F]/g, '');
        const bytes = hexStringToByteArray(sanitizedHexInput);
        hexDumpString = formatHexDump(bytes);
    }

    function formatHexDump(bytes, bytesPerLine = 16) {
        let result = "";
        for (let i = 0; i < bytes.length; i += bytesPerLine) {
            const slice = bytes.slice(i, i + bytesPerLine);

            const offset = i.toString(16).padStart(8, '0');

            const hexBytes = Array.from(slice, b => b.toString(16).padStart(2, '0')).join(' ');
            const hexPadded = hexBytes.padEnd(bytesPerLine * 3 - 1);

            const ascii = Array.from(slice, b => {
                const char = String.fromCharCode(b);
                return b >= 0x20 && b <= 0x7E ? char : '.';
            }).join('');

            result += `${offset}  ${hexPadded}  |${ascii}|\n`;
        }
        return result;
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
            <input type="text" id="hexInput" class="form-control" bind:value={hexInput} on:input={onDataChange}/>
        </div>
        <div class="form-group">
            <label for="sanitizedHexInput">Sanitized Hex String:</label>
            <input type="text" id="sanitizedHexInput" class="form-control" bind:value={sanitizedHexInput} readonly/>
        </div>
    </div>
    <div>
        <pre>{hexDumpString}</pre>
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
    .highlight {
        background-color: yellow; /* textmarker style */
        color: black;
    }
</style>