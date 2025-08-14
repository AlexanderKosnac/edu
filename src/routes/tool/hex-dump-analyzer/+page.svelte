<script>
    import { onMount } from "svelte";

    import { hexStringToByteArray } from "$lib/hexUtility";
    import { hexHttpRequest } from "./data.js";

    let hexInput = hexHttpRequest;
    let startAddress = 0;

    let sanitizedHexInput, hexDumpString;

    let highlights = [
        { start: 0x10, size: 0x04, color: "#ed333b", type: "int" },
        { start: 0x16, size: 0x03, color: "#57e389", type: "float" },
    ];

    function addHighlight() {
        highlights.push({ start: 0x00, size: 0x04, color: "#ed333b", type: "int" });
        highlights = highlights;
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

    function onDataChange() {
        sanitizedHexInput = hexInput.replace(/[^0-9a-fA-F]/g, '');
        const bytes = hexStringToByteArray(sanitizedHexInput);
        hexDumpString = formatHexDump(bytes, 16, startAddress, highlights);
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

            for (let i = 0; i < lineBytes.length; i++) {
                const offset = lineOffset + i;
                const highlight = getHighlightForOffset(offset);

                let hexByte = lineBytes[i].toString(16).padStart(2, '0');
                let asciiChar = (lineBytes[i] >= 0x20 && lineBytes[i] <= 0x7E) ? String.fromCharCode(lineBytes[i]) : '.';

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


    onMount(() => {
        onDataChange();
    });
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
</div>

<div class="row">
    <div class="col-auto">
        <pre>{@html hexDumpString}</pre>
    </div>
    <div class="col">
        <table class="table w-auto highlight-input-table">
        <thead>
            <tr>
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
                <td><input type="number" class="form-control offset-input" bind:value={highlights[i].start}/></td>
                <td><input type="number" class="form-control offset-input" bind:value={highlights[i].size}/></td>
                <td><input type="color" class="form-control form-control-color" bind:value={highlights[i].color}></td>
                <td>
                    <select class="form-select" bind:value={highlights[i].type}>
                        <option value="int">int</option>
                        <option value="float">float</option>
                    </select>
                </td>
                <td><button type="button" class="btn btn-outline-secondary" on:click={() => removeHighlight(i)}>&#x1F5D1;</button></td>
            </tr>
            {/each}
            <tr>
                <td rowspan="5"><button type="button" class="btn btn-primary" on:click={addHighlight}>New</button></td>
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