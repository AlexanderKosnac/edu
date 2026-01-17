<script>
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

    let encodingOptions = [
        { name: "Numeric", pattern: [1, 0, 0, 0] },
        { name: "Alphanumeric", pattern: [0, 1, 0, 0] },
        { name: "Binary", pattern: [0, 0, 1, 0] },
        { name: "Kanji", pattern: [0, 0, 0, 1] },
        { name: "Structured append", pattern: [1, 1, 0, 0] },
        { name: "ECI", pattern: [1, 1, 1, 0] },
        { name: "FNC1 in first position", pattern: [1, 0, 1, 0] },
        { name: "FNC1 in second position", pattern: [1, 0, 0, 1] },
        { name: "End of message", pattern: [0, 0, 0, 0] },
    ];
    let selectedEncodingOption = encodingOptions[1];

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

    function setCell(row, column, value, type) {
        if (row >= 0 && column >= 0 && row < qrcDim && column < qrcDim) {
            cells[row][column].value = value;
            cells[row][column].type = type;
        }
    }

    function setupCells() {
        cells = Array.from({ length: qrcDim }, () => Array.from({ length: qrcDim }, () => ({
            value: 0,
            type: UNUSED,
        })));
    }

    function drawPattern(row, column, pattern, type) {
        pattern.forEach((r, dy) => {
            r.forEach((c, dx) => {
                setCell(row + dx, column + dy, c, type);
            });
        });
    }

    // x and y define the position of the top left corner of the ID pattern
    function drawPositionSquare(row, column) {
        drawPattern(row, column, [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1],
        ], POSITION_SQUARE);
    }

    function drawAlignmentPattern(row, column) {
        drawPattern(row-2, column-2, [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1],
        ], ALIGNMENT_PATTERN);
    }

    function drawFormatInfoHorizontal(row, column, d) {
        drawLinePattern(row, column, d, true, _ => 1, FORMAT_INFO);
    }

    function drawFormatInfoVertical(row, column, d) {
        drawLinePattern(row, column, d, false, _ => 1, FORMAT_INFO);
    }

    function drawPatternStripHorizontal(row, column, pattern) {
        drawLinePattern(row, column, pattern.length, true, i => pattern[i], FORMAT_INFO);
    }

    function drawPatternStripVertical(row, column, pattern) {
        drawLinePattern(row, column, pattern.length, false, i => pattern[i], FORMAT_INFO);
    }

    function drawTimingStripHorizontal(row, column, d) {
        drawLinePattern(row, column, d, true, i => i % 2 ? 0 : 1, TIMING_STRIP);
    }

    function drawTimingStripVertical(row, column, d) {
        drawLinePattern(row, column, d, false, i => i % 2 ? 0 : 1, TIMING_STRIP);
    }

    function drawLinePattern(row, column, d, isHorizontal, patternFn, cellType) {
        for (let i = 0; i < d; i++) {
            const value = patternFn(i);
            if (isHorizontal) {
                setCell(row + i, column, value, cellType);
            } else {
                setCell(row, column + i, value, cellType);
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

    function* yieldAvailableDataCells() {
        const size = qrcDim;
        let col = size - 1;
        let upwards = true;

        while (col > 0) {
            if (col === 6) // Skip timing pattern at column 6
                col--;

            const rowIndices = [...Array(size).keys()];
            if (upwards)
                rowIndices.reverse();

            for (const r of rowIndices) {
                for (let c = col; c >= col - 1; c--) {
                    if (cells[r][c].type === UNUSED) {
                        yield { i: r, j: c };
                    }
                }
            }

            col -= 2;
            upwards = !upwards;
        }
    }

    function drawData(dataBits, type) {
        let i = 0;
        for (const { i: x, j: y } of yieldAvailableDataCells()) {
            if (i >= dataBits.length)
                break;
            setCell(x, y, dataBits[i], type);
            i++;
        }
    }

    function addData() {
        drawData([1], DATA);
    }

    function createQrCode() {
        setupCells();

        drawPositionSquare(0, 0);
        drawPositionSquare(qrcDim-7, 0);
        drawPositionSquare(0, qrcDim-7);
        drawAlignmentPattern(18, 18);

        setCell(17, 8, 1, FIXED_BLACK);

        drawLinePattern(0, 7, 8, true, i => 0, SEPARATOR);
        drawLinePattern(7, 0, 8, false, i => 0, SEPARATOR);

        drawLinePattern(qrcDim-8, 7, 8, true, i => 0, SEPARATOR);
        drawLinePattern(qrcDim-8, 0, 8, false, i => 0, SEPARATOR);

        drawLinePattern(0, qrcDim-8, 8, true, i => 0, SEPARATOR);
        drawLinePattern(7, qrcDim-8, 8, false, i => 0, SEPARATOR);

        drawFormatInfoHorizontal(0, 8, 9);
        drawFormatInfoVertical(8, 0, 9);

        drawFormatInfoHorizontal(18, 8, 7);
        drawFormatInfoVertical(8, 17, 8);

        drawPatternStripVertical(8, 0, selectedErrorCorrectionLevel.pattern);
        drawPatternStripHorizontal(23, 8, selectedErrorCorrectionLevel.pattern.toReversed());

        drawTimingStripHorizontal(8, 6, 9);
        drawTimingStripVertical(6, 8, 9);

        drawData(selectedEncodingOption.pattern, ENCODING);
        drawData(byteAsBinaryList(inputAscii.length * 8), DATA_LENGTH);

        drawData(charsAsBinaryList(inputAscii), DATA);
    }
</script>

<div class="row mb-1">
    <div class="col">
        <label for="asciiInput">ASCII Input:</label>
        <input type="text" id="asciiInput" class="form-control font-monospace" bind:value="{inputAscii}"/>

        <label>
            Encoding:
            <select class="form-select" bind:value={selectedEncodingOption}>
                {#each encodingOptions as o}
                    <option value={o}>{o.name}</option>
                {/each}
            </select>
        </label>

        <label>
            Error Correction Level:
            <select class="form-select" bind:value={selectedErrorCorrectionLevel}>
                {#each errorCorrectionLevels as l}
                    <option value={l}>{l.short} ({l.name}: ~{l.percentageRestoration}% restoration)</option>
                {/each}
            </select>
        </label>

        <button type="button" class="btn btn-primary" onclick={createQrCode}>Generate</button>
        <button type="button" class="btn btn-primary" onclick={addData}>Add Data</button>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <svg width="800" height="800" viewBox="0 0 {qrcDim*CELL_SIZE} {qrcDim*CELL_SIZE}">
        {#each cells as row, j}
            {#each row as cell, i}
            <rect class:highlighted={cell.type == selectedPart} class:white={cell.value == 0} class:black={cell.value == 1}
                x={i * CELL_SIZE} y={j * CELL_SIZE} width={CELL_SIZE} height={CELL_SIZE}
                part={cell.type}/>
            <text x={i * CELL_SIZE + 5} y={j * CELL_SIZE + 5} font-size="3" fill="grey" text-anchor="middle" dominant-baseline="middle">
                {i},{j}
            </text>
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