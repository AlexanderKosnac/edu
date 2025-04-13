<script>
    import { onMount } from "svelte";

    let canvasWidth = 50;
    let canvasHeight = 50;
    let canvas;

    let isRunning = false;
    let runButtonText = "Start";

    let ctx;
    let imageData;

    function setPixel(x, y, r, g, b) {
        const index = (y * canvas.width + x) * 4;
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255;
    }

    function render() {
        imageData = ctx.createImageData(canvas.width, canvas.height);
        for (let y = 0; y <= canvasHeight; y++) {
            for (let x = 0; x <= canvasWidth; x++) {
                if (isAlive(x, y)) {
                    setPixel(x, y, 0, 0, 0);
                } else {
                    setPixel(x, y, 255, 255, 255);
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    let cells = new Set();

    function setAlive(x, y) {
        cells.add(`${x},${y}`);
    }

    function isAlive(x, y) {
        return cells.has(`${x},${y}`);
    }

    function getNeighbors(x, y) {
        const deltas = [-1, 0, 1];
        const neighbors = [];
        for (let dx of deltas) {
            for (let dy of deltas) {
                if (dx === 0 && dy === 0) continue;
                neighbors.push([x + dx, y + dy]);
            }
        }
        return neighbors;
    }

    function step() {
        const neighborCounts = new Map();

        for (const cell of cells) {
            const [x, y] = cell.split(',').map(Number);
            for (const [nx, ny] of getNeighbors(x, y)) {
                const key = `${nx},${ny}`;
                neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
            }
        }

        const nextGen = new Set();
        for (const [cell, count] of neighborCounts.entries()) {
            const alive = cells.has(cell);
            if (count === 3 || (alive && count === 2)) {
                nextGen.add(cell);
            }
        }

        cells = nextGen;
    }

    function nextGeneration() {
        step();
        render();
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function startRun() {
        if (isRunning) return;
        isRunning = true;

        while (isRunning) {
            nextGeneration();
            await delay(100);
        }
    }

    function stopRun() {
        isRunning = false;
    }

    function toggleRun() {
        isRunning ? stopRun() : startRun();
    }

    onMount(()=> {
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setAlive(25+1, 25+0);
        setAlive(25+2, 25+1);
        setAlive(25+0, 25+2);
        setAlive(25+1, 25+2);
        setAlive(25+2, 25+2);
    });
</script>

<svelte:head>
    <title>Conway's Game of Life</title>
</svelte:head>

<div class="row">
    <div class="col">
        <div class="d-flex gap-1">
            <div>
                <span>Width:</span>
                <input type="number" class="form-control w-auto" step="1" bind:value={canvasWidth} min="10"/>
            </div>
            <div>
                <span>Height:</span>
                <input type="number" class="form-control w-auto" step="1" bind:value={canvasHeight} min="10"/>
            </div>
            <button type="button" class="btn btn-sm btn-outline-primary" on:click={nextGeneration}>Update</button>
            <button type="button" class="btn btn-sm btn-primary" on:click={toggleRun}>
                {isRunning ? "Stop" : "Start"}
            </button>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <canvas width="{canvasWidth}" height="{canvasHeight}" bind:this={canvas}></canvas>
    </div>
    <div class="col">
        Conway's Game of Life operates on a grid of cells that can either be alive, or dead.
        In which state they are, is determined by the following four rules:
        <ul>
            <li>Any live cell with fewer than two live neighbours dies.</li>
            <li>Any live cell with two or three live neighbours lives on.</li>
            <li>Any live cell with more than three live neighbours dies.</li>
            <li>Any dead cell with exactly three live neighbours becomes a live cell.</li>
        </ul>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">Conway's Game of Life (Wikipedia)</a></li>
        </ul>
    </div>
</div>

<style>
    canvas {
        image-rendering: pixelated;
        width: 600px;
        height: 600px;
        border: 1px solid var(--bs-body-color)
    }
</style>