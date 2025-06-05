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
                const p = getParticle(x, y);
                if (p) {
                    setPixel(x, y, p.color[0], p.color[1], p.color[2]);
                } else {
                    setPixel(x, y, 0, 0, 0);
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    let particles = new Map();

    function key(x, y) {
        return `${x},${y}`;
    }

    function xy(key) {
        return key.split(',').map(Number);
    }

    function getParticle(x, y) {
        return particles.get(key(x, y));
    }

    function setParticle(x, y, value) {
        if (value) {
            particles.set(key(x, y), value);
        } else {
            particles.delete(key(x, y));
        }
    }

    function step() {
        const nextGen = new Map();

        for (const cell of particles) {
            let p = new Particle(cell[1].color, cell[1].behavior);
            let [x, y] = xy(cell[0]);

            let xn = x, yn = y;
            if (getParticle(x, y + 1) == null && y + 1 < canvasHeight) {
                yn++;
            }
            else if (getParticle(x - 1, y + 1) == null && x - 1 >= 0 && y + 1 < canvasHeight) {
                xn--;
                yn++;
            }
            else if (getParticle(x + 1, y + 1) == null && x + 1 < canvasWidth && y + 1 < canvasHeight) {
                xn++;
                yn++;
            }

            nextGen.set(key(xn, yn), p);
        }

        particles = nextGen;
    }

    function nextGeneration() {
        step();
        render();
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function clearGrid() {
        particles = new Map();
        render();
    }

    function setParticleOnClick(e) {
        const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);
        let p = new Particle([255, 0, 0], (particles, x, y) => {});
        setParticle(x, y, p);
        render();
    }

    async function startRun() {
        const FRAME_DURATION = 1000 / 60;

        while (true) {
            const startTime = performance.now();

            nextGeneration();

            const endTime = performance.now();
            const elapsed = endTime - startTime;
            const delayTime = Math.max(0, FRAME_DURATION - elapsed);

            await delay(delayTime);
        }
    }

    onMount(()=> {
        ctx = canvas.getContext("2d");
        render();
        startRun();
    });
</script>

<svelte:head>
    <title>Particle Simulation</title>
</svelte:head>

<div class="row mb-1 mt-1">
    <div class="col">
        <div class="d-flex gap-1 align-items-center">
            <button type="button" class="btn btn-sm btn-primary" on:click={clearGrid}>Clear</button>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <canvas width="{canvasWidth}" height="{canvasHeight}" bind:this={canvas} on:click={setParticleOnClick}></canvas>
    </div>
    <div class="col">
        <div>
            <h3>Settings:</h3>
            <span>Grid Dimensions:</span>
            <div class="input-group">
                <input type="number" class="form-control" placeholder="Width" aria-label="Grid Width" step="1" bind:value={canvasWidth} min="1" />
                {#if !keepOneToOne}
                    <span class="input-group-text">x</span>
                    <input type="number" class="form-control" placeholder="Height" aria-label="Grid Height" step="1" bind:value={canvasHeight} min="1" />
                {/if}
                <div class="input-group-text">
                    <label>
                        <input type="checkbox" aria-label="Keep 1:1" bind:checked={keepOneToOne}/>
                        Keep 1:1
                    </label>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Falling-sand_game" target="_blank">Falling-sand game</a></li>
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