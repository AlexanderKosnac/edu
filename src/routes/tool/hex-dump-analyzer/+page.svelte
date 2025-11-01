<script>
    import { hexStringToByteArray } from "$lib/hexUtility";
    import { hexHttpRequest } from "./data.js";
    import { toHex } from "$lib/hexUtility";
    import { getContrastingColor, getRandomColor, getEvenlySpacedColorsHex } from "$lib/colorUtility";

    let hexInput = hexHttpRequest;
    let startAddress = 0x34;

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
        { start: 0x36, size: 0x04, color: "#ed333b", type: ByteType.FLOAT32_LE },
        { start: 0x40, size: 0x08, color: "#57e389", type: ByteType.INT64_LE },
    ];

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

    function addHighlight() {
        highlights.push({ start: 0x00, size: 0x04, color: getRandomColor(), type: ByteType.UINT32_LE });
        highlights = highlights;
    }

    function removeHighlight(i) {
        highlights.splice(i, 1);
        highlights = highlights;
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

    function autoAssignColors() {
        const n = highlights.length;
        const colors = getEvenlySpacedColorsHex(n);
        for (let i = 0; i < n; i++) {
            highlights[i].color = colors[i];
        }
        highlights = highlights;
    }

    function formatHexDump(bytes, bytesPerLine = 16, startAddress = 0, highlights = []) {
        let dump = "";

        function getHighlightForOffset(offset) {
            return highlights.find(h => offset >= h.start && offset < h.start + h.size);
        }

        const baseAddress = Math.floor(startAddress / 16) * 16;

        function atAddress(address) {
            return bytes[address - startAddress];
        }

        const nLines = Math.ceil((startAddress - baseAddress + bytes.length) / bytesPerLine);

        for (let i = 0; i < nLines; i++) {
            const lineAddress = baseAddress + i * bytesPerLine;

            const hexParts = [];
            const asciiParts = [];

            for (let j = 0; j < bytesPerLine; j++) {
                const byteAddress = lineAddress + j;
                const highlight = getHighlightForOffset(byteAddress);

                let b = atAddress(byteAddress);
                let hex = b === undefined ? "  " : toHex(b);
                let ascii = b === undefined ? " " : (b >= 0x20 && b <= 0x7E) ? String.fromCharCode(b) : ".";

                if (highlight) {
                    const fontColor = getContrastingColor(highlight.color);
                    hex = `<span style="color: ${fontColor}; background-color: ${highlight.color}">${hex}</span>`;
                    ascii = `<span style="color: ${fontColor}; background-color: ${highlight.color}">${ascii}</span>`;
                }

                hexParts.push(hex);
                asciiParts.push(ascii);
            }

            dump += `${toHex(lineAddress, 8)}  ${hexParts.join(" ")}  |${asciiParts.join("")}|\n`;
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
            {@const highlightStartIdx = highlights[i].start - startAddress}
            <tr>
                <td>
                    {#if highlightStartIdx >= 0 && highlightStartIdx + highlights[i].size <= byteData?.length }
                        <samp>
                            {interpretBytes(highlightStartIdx, highlights[i].size, highlights[i].type)}
                        </samp>
                    {:else}
                        Out of bounds
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
                <td><button type="button" class="btn btn-outline-secondary" onclick={() => removeHighlight(i)}>&#x1F5D1;</button></td>
            </tr>
            {/each}
            <tr>
                <td colspan="6">
                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-primary" onclick={addHighlight}>New</button>

                        <div>
                            <button type="button" class="btn btn-secondary" onclick={autoAssignColors}>Auto Colors</button>
                        </div>

                        <div>
                            <button type="button" class="btn btn-primary" onclick={exportHighlights}>Export</button>
                            <button type="button" class="btn btn-primary" onclick={importHighlights}>Import</button>
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