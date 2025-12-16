<script>
    import { onMount } from "svelte";
    import { imageDataToBraille } from "$lib/brailleUtility.js";

    let canvasWidth = 16;
    let canvasHeight = 16;

    let canvas;
    let ctx;

    let braille = "";

    let isDrawing = false;
    let drawColor = [0, 0, 0];

    $: if (ctx && canvasWidth && canvasHeight) resizeCanvas();

    function setPixel(x, y, r, g, b) {
        const imgData = ctx.getImageData(x, y, 1, 1);
        const data = imgData.data;

        data[0] = r;
        data[1] = g;
        data[2] = b;
        data[3] = 255;

        ctx.putImageData(imgData, x, y);
    }

    function startDrawing(e, color) {
        isDrawing = true;
        drawColor = color;
        draw(e);
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function draw(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);
        setPixel(x, y, ...drawColor);
        braille = imageDataToBraille(ctx.getImageData(0, 0, canvasWidth, canvasHeight));
    }

    function resizeCanvas() {
        const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        const data = structuredClone(imageData.data);

        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            if (alpha === 0) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 0;
                data[i + 3] = 255;
            }
        }
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        ctx.putImageData(imageData, 0, 0);
    }

    function clearCanvas() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        braille = imageDataToBraille(ctx.getImageData(0, 0, canvasWidth, canvasHeight));
    }

    onMount(() => {
        ctx = canvas.getContext("2d");
        clearCanvas();
    });
</script>

<svelte:head>
    <title>Draw Braille</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Draw Braille</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="d-flex flex-row gap-1 mb-1">
            <button type="button" class="btn btn-secondary" on:click={clearCanvas}>Clear</button>
            <div class="input-group">
                <span class="input-group-text">Dimensions</span>
                <input type="number" class="form-control" placeholder="Width" aria-label="Grid Width" step="2" min="2" bind:value={canvasWidth}/>
                <span class="input-group-text">x</span>
                <input type="number" class="form-control" placeholder="Height" aria-label="Grid Height" step="4" min="4" bind:value={canvasHeight}/>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <canvas width={canvasWidth} height={canvasHeight} bind:this={canvas}
            on:mousedown={e => e.button === 0 ? startDrawing(e, [0, 0, 0]) : startDrawing(e, [255, 255, 255])}
            on:mouseup={stopDrawing}
            on:mouseleave={stopDrawing} on:mousemove={draw}
            on:contextmenu={e => e.preventDefault()}>
        </canvas>
    </div>
    <div class="col">
        <pre>{braille}</pre>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Braille_Patterns" target="_blank">Braille Patterns</a></li>
        </ul>
    </div>
</div>

<style>
    canvas {
        image-rendering: pixelated;
        height: 600px;
        border: 1px solid var(--bs-body-color);
        cursor: crosshair;
    }
</style>
