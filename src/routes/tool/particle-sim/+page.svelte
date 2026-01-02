<script>
    import { onMount } from "svelte";

    import { Particle } from "./particles.js";

    let canvasWidth = 50;
    let canvasHeight = 50;
    let keepOneToOne = true;

    $: if (keepOneToOne) {
        canvasHeight = canvasWidth;
    }

    let canvas;
    let ctx;
    let imageData;


    let grid = [];

    function resizeGrid() {
        grid = new Array(canvasWidth * canvasHeight).fill(null);
    }

    function index(x, y) {
        return y * canvasWidth + x;
    }

    function inBounds(x, y) {
        return x >= 0 && x < canvasWidth && y >= 0 && y < canvasHeight;
    }

    function getParticle(x, y) {
        if (!inBounds(x, y)) return null;
        return grid[index(x, y)];
    }

    function setParticle(x, y, value) {
        if (!inBounds(x, y)) return;
        grid[index(x, y)] = value;
    }

    function clearGrid() {
        grid.fill(null);
        render();
    }

    function setPixel(x, y, r, g, b) {
        const i = (y * canvas.width + x) * 4;
        imageData.data[i + 0] = r;
        imageData.data[i + 1] = g;
        imageData.data[i + 2] = b;
        imageData.data[i + 3] = 255;
    }

    function render() {
        if (!ctx || canvasWidth === 0 || canvasHeight === 0) return;

        imageData = ctx.createImageData(canvasWidth, canvasHeight);

        for (let y = 0; y < canvasHeight; y++) {
            for (let x = 0; x < canvasWidth; x++) {
                const p = getParticle(x, y);
                if (p) {
                    const [r, g, b] = p.color;
                    setPixel(x, y, r, g, b);
                } else {
                    setPixel(x, y, 0, 0, 0);
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function step() {
        const nextGrid = new Array(canvasWidth * canvasHeight).fill(null);

        const cells = [];
        for (let y = 0; y < canvasHeight; y++) {
            for (let x = 0; x < canvasWidth; x++) {
                const p = getParticle(x, y);
                if (p) cells.push({ x, y, p });
            }
        }

        shuffle(cells);

        for (const { x, y, p } of cells) {
            let xn = x;
            let yn = y;

            if (inBounds(x, y + 1) && !getParticle(x, y + 1)) {
                yn++;
            }
            else if (inBounds(x - 1, y + 1) && !getParticle(x - 1, y + 1)) {
                xn--;
                yn++;
            }
            else if (inBounds(x + 1, y + 1) && !getParticle(x + 1, y + 1)) {
                xn++;
                yn++;
            }

            const i = index(xn, yn);

            if (nextGrid[i] === null) {
                nextGrid[i] = p;
            } else {
                nextGrid[index(x, y)] = p;
            }
        }

        grid = nextGrid;
    }

    function nextGeneration() {
        step();
        render();
    }

    function setParticleOnClick(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);

        const p = new Particle([255, 0, 0]);
        setParticle(x, y, p);
        render();
    }

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function startRun() {
        const FRAME_DURATION = 1000 / 60;

        while (true) {
            const start = performance.now();
            nextGeneration();
            const elapsed = performance.now() - start;
            await delay(Math.max(0, FRAME_DURATION - elapsed));
        }
    }

    onMount(() => {
        ctx = canvas.getContext("2d");
        resizeGrid();
        render();
        startRun();
    });

    $: resizeGrid();
</script>

<svelte:head>
    <title>Particle Simulation</title>
</svelte:head>

<div class="row mb-1 mt-1">
    <div class="col">
        <button class="btn btn-sm btn-primary" on:click={clearGrid}> Clear </button>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <canvas bind:this={canvas} width={canvasWidth} height={canvasHeight} on:click={setParticleOnClick}></canvas>
    </div>

    <div class="col">
        <h3>Settings</h3>
        <input type="number" bind:value={canvasWidth} min="1" />
        {#if !keepOneToOne}
            <input type="number" bind:value={canvasHeight} min="1" />
        {/if}
        <label>
            <input type="checkbox" bind:checked={keepOneToOne} />
            Keep 1:1
        </label>
    </div>
</div>

<style>
    canvas {
        image-rendering: pixelated;
        width: 600px;
        height: 600px;
        border: 1px solid var(--bs-body-color);
    }
</style>
