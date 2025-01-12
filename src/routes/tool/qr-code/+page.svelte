<script>
    import { onMount } from "svelte";

    const CELL_SIZE = 10;

    let inputAscii = "edu";

    let qrcDim = 21;
    let cells = [];
    $: {
        cells = Array.from({ length: qrcDim**2 }, () => ({
            value: 0,
            type: "data"
        }));
    }

    function setCell(x, y, value, type) {
        const idx = y * qrcDim + x;
        if (idx >= 0 && idx < cells.length) {
            cells[idx].value = value;
            cells[idx].type = type;
        }
    }

    function drawPattern(x, y, pattern, type) {
        pattern.forEach((row, dy) => {
            row.forEach((cell, dx) => {
                setCell(x + dx, y + dy, cell, type);
            });
        });
    }

    // x and y define the position of the top left corner of the ID pattern
    function drawQrId(x, y) {
        drawPattern(x-1, y-1, [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 1, 1, 1, 0, 1, 0], 
            [0, 1, 0, 1, 1, 1, 0, 1, 0],
            [0, 1, 0, 1, 1, 1, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ], "id");
    }

    function charsAsBinaryDumpLines(input) {
        const padding = `${input.length}`.length;
        return input.split("").map((c, i) => `${i.toString().padStart(padding, " ")} ${c.charCodeAt(0).toString(2).padStart(8, "0")} ${c}`);
    }

    onMount(()=> {
        setCell(5, 5, 1, "asd");
        drawQrId(0, 0);
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

<div class="row">
    <div class="col-auto">
        <svg width="600" height="600" viewBox="0 0 {CELL_SIZE*qrcDim} {Math.ceil(cells.length/qrcDim)*CELL_SIZE}">
            {#each cells as cell, i}
            <rect class:white={cell.value == 0} class:black={cell.value == 1}
                x="{(i%qrcDim)*CELL_SIZE}" y="{Math.floor(i/qrcDim)*CELL_SIZE}"
                width="{CELL_SIZE}" height="{CELL_SIZE}"/>
            {/each}
        </svg>
    </div>

    <div class="col">
        <label for="asciiInput">ASCII Input:</label>
        <input type="text" id="asciiInput" class="form-control font-monospace" bind:value="{inputAscii}"/>
        <br>
        Input as Binary Data:<br>
        {#each charsAsBinaryDumpLines(inputAscii) as bitsString}
            <span class="font-monospace">{bitsString}</span><br>
        {/each}
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
        stroke: #EEEEEE;
        fill: white;
    }
    rect.white {
        stroke: transparent;
        fill: white;
    }
    rect.black {
        stroke: transparent;
        fill: black;
    }
</style>