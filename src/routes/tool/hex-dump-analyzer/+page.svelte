<script>
    import { hexStringToByteArray } from "$lib/hexUtility";
    import { hexHttpRequest } from "./data.js";

    let hexInput = hexHttpRequest;
    let startAddress = 0;

    const ByteType = Object.freeze({
        INT8: "int8",
        UINT8: "uint8",
        INT16_LE: "int16",
        INT16_BE: "int16 (big-endian)",
        UINT16_LE: "uint16",
        UINT16_BE: "uint16 (big-endian)",
        INT32_LE: "int32",
        INT32_BE: "int32 (big-endian)",
        UINT32_LE: "uint32",
        UINT32_BE: "uint32 (big-endian)",
        INT64_LE: "int64",
        INT64_BE: "int64 (big-endian)",
        UINT64_LE: "uint64",
        UINT64_BE: "uint64 (big-endian)",
        FLOAT32_LE: "float32",
        FLOAT32_BE: "float32 (big-endian)",
        FLOAT64_LE: "float64",
        FLOAT64_BE: "float64 (big-endian)",
        ASCII: "ASCII",
    });

    let highlights = [
        { start: 0x10, size: 0x04, color: "#ed333b", type: ByteType.UINT32_BE },
        { start: 0x16, size: 0x03, color: "#57e389", type: ByteType.FLOAT32_BE },
    ];

    function addHighlight() {
        highlights.push({ start: 0x00, size: 0x04, color: "#ed333b", type: ByteType.UINT32_BE });
        highlights = highlights;
    }

    function exportHighlights() {
        prompt("Save the highlight export below:", JSON.stringify(highlights));
    }

    function importHighlights() {
        try {
            highlights = JSON.parse(prompt("Input the highlight json to load:"));
        } catch (error) {
            alert(`Failed to import highlights: ${error}`);
        }
    }

    function removeHighlight(i) {
        highlights.splice(i, 1);
        highlights = highlights;
    }

    function getContrastingColor(bgColor) {
        let r = parseInt(bgColor.substr(1, 2), 16) / 255;
        let g = parseInt(bgColor.substr(3, 2), 16) / 255;
        let b = parseInt(bgColor.substr(5, 2), 16) / 255;

        [r, g, b] = [r, g, b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

        let lb = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        return (lb > 0.179) ? "#000000" : "#FFFFFF";
    }

    $: sanitizedHexInput = hexInput.replace(/[^0-9a-fA-F]/g, '');
    $: byteData = hexStringToByteArray(sanitizedHexInput);
    $: hexDumpString = formatHexDump(byteData ?? [], 16, startAddress, highlights);

    function interpretBytes(offset, length, type) {
        const slice = byteData.slice(offset, offset + length);
        const view = new DataView(slice.buffer, slice.byteOffset, slice.byteLength);
        const invalid = "Invalid";
        switch (type) {
            case ByteType.INT8:
                return length == 1 ? view.getInt8(0) : invalid;
            case ByteType.UINT8:
                return length == 1 ? view.getUint8(0) : invalid;
            case ByteType.INT16_LE:
                return length == 2 ? view.getInt16(0, true) : invalid;
            case ByteType.INT16_BE:
                return length == 2 ? view.getInt16(0, false) : invalid;
            case ByteType.UINT16_LE:
                return length == 2 ? view.getUint16(0, true) : invalid;
            case ByteType.UINT16_BE:
                return length == 2 ? view.getUint16(0, false) : invalid;
            case ByteType.INT32_LE:
                return length == 4 ? view.getInt32(0, true) : invalid;
            case ByteType.INT32_BE:
                return length == 4 ? view.getInt32(0, false) : invalid;
            case ByteType.UINT32_LE:
                return length == 4 ? view.getUint32(0, true) : invalid;
            case ByteType.UINT32_BE:
                return length == 4 ? view.getUint32(0, false) : invalid;
            case ByteType.INT64_LE:
                return length == 8 ? view.getBigInt64(0, true) : invalid;
            case ByteType.INT64_BE:
                return length == 8 ? view.getBigInt64(0, false) : invalid;
            case ByteType.UINT64_LE:
                return length == 8 ? view.getBigUint64(0, true) : invalid;
            case ByteType.UINT64_BE:
                return length == 8 ? view.getBigUint64(0, false) : invalid;
            case ByteType.FLOAT32_LE:
                return length == 4 ? view.getFloat32(0, true) : invalid;
            case ByteType.FLOAT32_BE:
                return length == 4 ? view.getFloat32(0, false) : invalid;
            case ByteType.FLOAT64_LE:
                return length == 8 ? view.getFloat64(0, true) : invalid;
            case ByteType.FLOAT64_BE:
                return length == 8 ? view.getFloat64(0, false) : invalid;
            case ByteType.ASCII:
                return length > 0 ? new TextDecoder("ascii").decode(slice) : invalid;
            default:
                return "Unhandled";
        }
    }

    function formatHexDump(bytes, bytesPerLine = 16, startOffset = 0, highlights = []) {
        let dump = "";

        const padBytes = startOffset % bytesPerLine;
        let index = 0;

        function getHighlightForOffset(offset) {
            return highlights.find(h => offset >= h.start && offset < h.start + h.size);
        }

        while (index < bytes.length) {
            const padCount = index === 0 ? padBytes : 0;
            const lineOffset = startOffset + index - padCount;

            const address = lineOffset.toString(16).padStart(8, '0');

            const lineBytes = bytes.slice(index, index + bytesPerLine - padCount);

            let hexParts = [];
            let asciiParts = [];

            for (let i = 0; i < padCount; i++) {
                hexParts.push("  ");
                asciiParts.push(" ");
            }

            for (let i = 0; i < bytesPerLine; i++) {
                const offset = lineOffset + i;
                const highlight = getHighlightForOffset(offset);

                let outOfBounds = i >= lineBytes.length;

                let hexByte = outOfBounds ? "  " : lineBytes[i].toString(16).padStart(2, '0');
                let asciiChar = outOfBounds ? " " : (lineBytes[i] >= 0x20 && lineBytes[i] <= 0x7E) ? String.fromCharCode(lineBytes[i]) : '.';

                if (highlight) {
                    const fontColor = getContrastingColor(highlight.color);
                    hexByte = `<span style="color: ${fontColor}; background-color: ${highlight.color}">${hexByte}</span>`;
                    asciiChar = `<span style="color: ${fontColor}; background-color: ${highlight.color}">${asciiChar}</span>`;
                }

                hexParts.push(hexByte);
                asciiParts.push(asciiChar);
            }

            let hex = hexParts.join(' ').padEnd(bytesPerLine * 3 - 1, ' ');
            let ascii = asciiParts.join('').padEnd(bytesPerLine, ' ');

            dump += `${address}  ${hex}  |${ascii}|\n`;

            index += lineBytes.length;
        }

        return dump;
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
            <label for="startAddressInput">Start Address:</label>
            <input type="number" id="startAddressInput" class="form-control" min="0" bind:value={startAddress}/>
        </div>
        <div class="form-group">
            <label for="sanitizedHexInput">Sanitized Hex String:</label>
            <input type="text" id="sanitizedHexInput" class="form-control" value={sanitizedHexInput} readonly/>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <pre>{@html hexDumpString}</pre>
    </div>
    <div class="col">
        <table class="table w-auto highlight-input-table">
        <thead>
            <tr>
                <th scope="col">Value</th>
                <th scope="col">Offset</th>
                <th scope="col">Size</th>
                <th scope="col">Color</th>
                <th scope="col">Type</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            {#each highlights as _, i}
            <tr>
                <td>
                    {#if byteData?.length >= highlights[i].start + highlights[i].size}
                        {interpretBytes(highlights[i].start, highlights[i].size, highlights[i].type)}
                    {/if}
                </td>
                <td><input type="number" class="form-control offset-input" min="0" bind:value={highlights[i].start}/></td>
                <td><input type="number" class="form-control offset-input" min="0" bind:value={highlights[i].size}/></td>
                <td><input type="color" class="form-control form-control-color" bind:value={highlights[i].color}></td>
                <td>
                    <select class="form-select" bind:value={highlights[i].type}>
                        {#each Object.values(ByteType) as value}
                            <option value={value}>{value}</option>
                        {/each}
                    </select>
                </td>
                <td><button type="button" class="btn btn-outline-secondary" on:click={() => removeHighlight(i)}>&#x1F5D1;</button></td>
            </tr>
            {/each}
            <tr>
                <td colspan="6">
                    <div class="d-flex justify-content-between">
                      <button type="button" class="btn btn-primary" on:click={addHighlight}>New</button>

                      <div>
                          <button type="button" class="btn btn-primary" on:click={exportHighlights}>Export</button>
                          <button type="button" class="btn btn-primary" on:click={importHighlights}>Import</button>
                      </div>
                    </div>
                </td>
            </tr>
        </tbody>
        </table>
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
    .offset-input {
        width: 6em;
    }
</style>