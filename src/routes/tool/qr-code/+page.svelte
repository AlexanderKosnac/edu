<script>
    import { onMount } from "svelte";

    const NONE = "none";
    const UNUSED = "unused";
    const ENCODING = "encoding";
    const DATA_LENGTH = "data-length";
    const DATA = "data";
    const POSITION_SQUARE = "position-square";
    const SEPARATOR = "separator";
    const ALIGNMENT_PATTERN = "alignment-pattern";
    const FORMAT_INFO = "format-info";
    const TIMING_STRIP = "timing-strip";
    const FIXED_BLACK = "fixed-black";

    let parts = [
        NONE,
        UNUSED,
        ENCODING,
        DATA_LENGTH,
        DATA,
        POSITION_SQUARE,
        SEPARATOR,
        ALIGNMENT_PATTERN,
        FORMAT_INFO,
        TIMING_STRIP,
        FIXED_BLACK,
    ];
    let selectedPart = parts[0];

    let errorCorrectionLevels = [
        { name: "Low", short: "L", percentageRestoration:  7, pattern: [0, 1] },
        { name: "Medium", short: "M", percentageRestoration: 15, pattern: [0, 0] },
        { name: "Quartile", short: "Q", percentageRestoration: 25, pattern: [1, 1] },
        { name: "High", short: "H", percentageRestoration: 30, pattern: [1, 0] },
    ];
    let selectedErrorCorrectionLevel = errorCorrectionLevels[0];

    const CELL_SIZE = 10;

    let inputAscii = "edu";

    let qrcDim = 25;
    let cells = [];

    function setCell(x, y, value, type) {
        if (x >= 0 && y >= 0 && x < qrcDim && y < qrcDim) {
            cells[x][y].value = value;
            cells[x][y].type = type;
        }
    }

    function setupCells() {
        cells = Array.from({ length: qrcDim }, () => Array.from({ length: qrcDim }, () => ({
            value: 0,
            type: UNUSED,
        })));
    }

    function drawPattern(x, y, pattern, type) {
        pattern.forEach((row, dy) => {
            row.forEach((cell, dx) => {
                setCell(x + dx, y + dy, cell, type);
            });
        });
    }

    // x and y define the position of the top left corner of the ID pattern
    function drawPositionSquare(x, y) {
        drawPattern(x, y, [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1],
        ], POSITION_SQUARE);
    }

    function drawAlignmentPattern(x, y) {
        drawPattern(x-2, y-2, [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1],
        ], ALIGNMENT_PATTERN);
    }

    function drawFormatInfoHorizontal(x, y, d) {
        drawLinePattern(x, y, d, true, _ => 1, FORMAT_INFO);
    }

    function drawFormatInfoVertical(x, y, d) {
        drawLinePattern(x, y, d, false, _ => 1, FORMAT_INFO);
    }

    function drawPatternStripHorizontal(x, y, pattern) {
        drawLinePattern(x, y, pattern.length, true, i => pattern[i], FORMAT_INFO);
    }

    function drawPatternStripVertical(x, y, pattern) {
        drawLinePattern(x, y, pattern.length, false, i => pattern[i], FORMAT_INFO);
    }

    function drawTimingStripHorizontal(x, y, d) {
        drawLinePattern(x, y, d, true, i => i % 2 ? 0 : 1, TIMING_STRIP);
    }

    function drawTimingStripVertical(x, y, d) {
        drawLinePattern(x, y, d, false, i => i % 2 ? 0 : 1, TIMING_STRIP);
    }

    function drawLinePattern(x, y, d, isHorizontal, patternFn, cellType) {
        for (let i = 0; i < d; i++) {
            const value = patternFn(i);
            if (isHorizontal) {
                setCell(x + i, y, value, cellType);
            } else {
                setCell(x, y + i, value, cellType);
            }
        }
    }

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

    function drawData(dataBits, type) {
        let x = qrcDim - 1;
        let y = qrcDim - 1;
        let bitIndex = 0;
        let direction = -1;

        while (x > 0) {
            for (let step = 0; step < qrcDim; step++) {
                for (let i = 0; i < 2; i++) {
                    let dx = x - i;
                    let dy = y;

                    if (cells[dx][dy].type === UNUSED && bitIndex < dataBits.length) {
                        setCell(dx, dy, dataBits[bitIndex], type);
                        bitIndex++;
                    }

                    if (i === 1) {
                        dy += direction;
                        if (dy < 0 || dy >= qrcDim) {
                            direction = -direction;
                            x -= 2;
                            break;
                        }
                        y = dy;
                    }
                }
            }
        }
    }

    function createQrCode() {
        setupCells();

        drawPositionSquare(0, 0);
        drawPositionSquare(qrcDim-7, 0);
        drawPositionSquare(0, qrcDim-7);
        drawAlignmentPattern(18, 18);

        setCell(8, 17, 1, FIXED_BLACK);

        drawLinePattern(0, 7, 8, true, i => 0, SEPARATOR);
        drawLinePattern(7, 0, 8, false, i => 0, SEPARATOR);

        drawLinePattern(qrcDim-8, 7, 8, true, i => 0, SEPARATOR);
        drawLinePattern(qrcDim-8, 0, 8, false, i => 0, SEPARATOR);

        drawLinePattern(0, qrcDim-8, 8, true, i => 0, SEPARATOR);
        drawLinePattern(7, qrcDim-8, 8, false, i => 0, SEPARATOR);

        drawFormatInfoHorizontal(0, 8, 9);
        drawFormatInfoVertical(8, 0, 9);

        drawFormatInfoHorizontal(17, 8, 8);
        drawFormatInfoVertical(8, 18, 7);

        drawPatternStripHorizontal(0, 8, selectedErrorCorrectionLevel.pattern);
        drawPatternStripVertical(8, 23, selectedErrorCorrectionLevel.pattern.reverse());

        drawTimingStripHorizontal(8, 6, 9);
        drawTimingStripVertical(6, 8, 9);

        drawData([0, 1, 0, 0], ENCODING);
        drawData(byteAsBinaryList(inputAscii.length * 8), DATA_LENGTH);
        drawData(charsAsBinaryList(inputAscii), DATA);
    }

    onMount(()=> {
        createQrCode();
    });
</script>

<svelte:head>
    <title>QR Code</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>QR Code</h1>
    </div>
</div>

<div class="row mb-1">
    <div class="col">
        <label for="asciiInput">ASCII Input:</label>
        <input type="text" id="asciiInput" class="form-control font-monospace" bind:value="{inputAscii}" on:input={createQrCode}/>

        <label>
            Error Correction Level:
            <select class="form-select" bind:value={selectedErrorCorrectionLevel} on:change={createQrCode}>
                {#each errorCorrectionLevels as l}
                    <option value={l}>{l.short} ({l.name}: ~{l.percentageRestoration}% restoration)</option>
                {/each}
            </select>
        </label>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <svg width="600" height="600" viewBox="0 0 {qrcDim*CELL_SIZE} {qrcDim*CELL_SIZE}">
        {#each cells as row, i}
            {#each row as cell, j}
            <rect class:highlighted={cell.type == selectedPart} class:white={cell.value == 0} class:black={cell.value == 1}
                x="{i*CELL_SIZE}" y="{j*CELL_SIZE}" width="{CELL_SIZE}" height="{CELL_SIZE}"
                part="{cell.type}"/>
            {/each}
        {/each}
        </svg>
    </div>

    <div class="col">
        <label>
            Part to highlight:
            <select class="form-select" bind:value={selectedPart}>
                {#each parts as p}
                    <option value={p}>{p}</option>
                {/each}
            </select>
        </label>

        <div>
            Input as Binary Data:
            <pre>{#each charsAsBinaryDumpLines(inputAscii) as bitsString}<span class="font-monospace">{bitsString}</span><br>{/each}</pre>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/QR_code" target="_blank">QR code</a></li>
            <li><a href="https://www.youtube.com/watch?v=w5ebcowAJD8" target="_blank">Veritasium video on QR codes</a></li>
        </ul>
    </div>
</div>

<style>
    svg {
        background-color: white;
        border: 1px solid black;
    }
    rect {
        stroke: transparent;
        fill: white;
    }
    rect.white {
        fill: white;
    }
    rect.black {
        fill: black;
    }
    rect.white.highlighted {
        fill: rgb(255, 128, 128);
    }
    rect.black.highlighted {
        fill: rgb(128, 0, 0);
    }
</style>