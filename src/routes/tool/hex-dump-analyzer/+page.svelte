<script>
    import { hexStringToByteArray } from "$lib/hexUtility";

    let hexInput = "48656c6c6f";
    let startAddress = 0;

    let sanitizedHexInput, hexDumpString;

    function onDataChange() {
        sanitizedHexInput = hexInput.replace(/[^0-9a-fA-F]/g, '');
        const bytes = hexStringToByteArray(sanitizedHexInput);
        hexDumpString = formatHexDump(bytes, 16, startAddress);
    }

    function formatHexDump(bytes, bytesPerLine = 16, startOffset = 0) {
        let result = "";

        const padBytes = startOffset % bytesPerLine;
        let index = 0;

        while (index < bytes.length) {
            const lineOffset = startOffset + index - padBytes; // start of the line in address space

            const offsetStr = lineOffset.toString(16).padStart(8, '0');

            let slice, hexBytes, ascii;

            if (index === 0 && padBytes > 0) {
                const lineBytes = bytes.slice(0, bytesPerLine - padBytes);
                hexBytes =
                    "   ".repeat(padBytes) +
                    Array.from(lineBytes, b => b.toString(16).padStart(2, '0')).join(' ');
                hexBytes = hexBytes.padEnd(bytesPerLine * 3 - 1, ' ');

                ascii = " ".repeat(padBytes) +
                    Array.from(lineBytes, b => {
                        const char = String.fromCharCode(b);
                        return b >= 0x20 && b <= 0x7E ? char : '.';
                    }).join('');

                index += lineBytes.length;
            } else {
                slice = bytes.slice(index, index + bytesPerLine);
                hexBytes = Array.from(slice, b => b.toString(16).padStart(2, '0')).join(' ');
                hexBytes = hexBytes.padEnd(bytesPerLine * 3 - 1, ' ');

                ascii = Array.from(slice, b => {
                    const char = String.fromCharCode(b);
                    return b >= 0x20 && b <= 0x7E ? char : '.';
                }).join('').padEnd(16, " ");

                index += slice.length;
            }

            result += `${offsetStr}  ${hexBytes}  |${ascii}|\n`;
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
            <label for="startAddressInput">Start Address:</label>
            <input type="number" id="startAddressInput" class="form-control" min="0" bind:value={startAddress} on:input={onDataChange}/>
        </div>
        <div class="form-group">
            <label for="sanitizedHexInput">Sanitized Hex String:</label>
            <input type="text" id="sanitizedHexInput" class="form-control" bind:value={sanitizedHexInput} readonly/>
        </div>
    </div>
    <div>
        <pre>{hexDumpString}</pre>
    </div>
<pre>
00000000: 48 65 6c 6c <span class="highlight">6f</span> 20 77 6f 72 6c 64 21 20 54 68 69
00000010: 73 20 69 73 20 61 <span class="highlight-red">20</span>74 65 73 74 2e 0a
</pre>
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