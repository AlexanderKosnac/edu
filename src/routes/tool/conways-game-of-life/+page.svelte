<script>
    import { onMount } from "svelte";

    import { golPatterns } from "./patterns.js";

    let canvasWidth = 50;
    let canvasHeight = 50;
    let canvas;

    let selectedPattern = null;
    let isRunning = false;
    let ticksPerSecond = 5;

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
        if (canvas.width === 0 || canvas.height === 0) return;
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
            await delay(1000/ticksPerSecond);
        }
    }

    function stopRun() {
        isRunning = false;
    }

    function toggleRun() {
        isRunning ? stopRun() : startRun();
    }

    function clearGrid() {
        cells = new Set();
        render();
    }

    function setCellOnClick(e) {
        const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);
        if (selectedPattern == null) {
            setAlive(x, y);
        } else {
            drawPattern(selectedPattern, x, y);
        }
        render();
    }

    function drawPattern(name, x, y) {
        const lines = golPatterns[name].trim().split("\n");
        for (let yi = 0; yi < lines.length; yi++) {
            const line = lines[yi];
            for (let xi = 0; xi < line.length; xi++) {
                if (line[xi] === "#") setAlive(x + xi, y + yi);
            }
        }
    }

    onMount(()=> {
        ctx = canvas.getContext("2d");
        drawPattern("Gosper glider gun", 5, 10);
        render();
    });
</script>

<svelte:head>
    <title>Conway's Game of Life</title>
</svelte:head>

<div class="row mb-1 mt-1">
    <div class="col">
        <div class="d-flex gap-1 align-items-center">
            <button type="button" class="btn btn-sm btn-primary" on:click={toggleRun}>
                {isRunning ? "Stop" : "Start"}
            </button>
            <button type="button" class="btn btn-sm btn-primary" on:click={clearGrid}>Clear</button>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <canvas width="{canvasWidth}" height="{canvasHeight}" bind:this={canvas} on:click={setCellOnClick}></canvas>
    </div>
    <div class="col">
        <div>
            Conway's Game of Life operates on a grid of cells that can either be alive, or dead.
            In which state they are, is determined by the following four rules:
            <ul>
                <li>Any live cell with fewer than two live neighbours dies.</li>
                <li>Any live cell with two or three live neighbours lives on.</li>
                <li>Any live cell with more than three live neighbours dies.</li>
                <li>Any dead cell with exactly three live neighbours becomes a live cell.</li>
            </ul>    
        </div>
        <hr/>
        <div>
            <h3>Statistics:</h3>
            <ul>
                <li>Alive Cells: {cells.size}</li>
            </ul>
        </div>
        <hr/>
        <div>
            <h3>Settings:</h3>
            <div class="d-flex flex-column flex-wrap">
                <label for="cars">
                    Brush:
                    <select class="form-select" bind:value={selectedPattern}>
                        <option value={null}>Single Cell</option>
                        {#each Object.entries(golPatterns) as [name, _]}
                            <option value={name}>{name}</option>
                        {/each}
                    </select>
                </label>
            </div>

            <span>Grid Dimensions:</span>
            <div class="input-group">
                <input type="number" class="form-control" placeholder="Width" aria-label="Grid Width" step="1" bind:value={canvasWidth} min="1" />
                <span class="input-group-text">x</span>
                <input type="number" class="form-control" placeholder="Height" aria-label="Grid Height" step="1" bind:value={canvasHeight} min="1" />
            </div>

            <label>
                Ticks per Second:
                <input type="number" class="form-control" placeholder="Ticks per second" aria-label="Ticks per second" step="1" bind:value={ticksPerSecond} min="1" />
            </label>
        </div>
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