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
        const oldImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const newImageData = ctx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < newImageData.data.length; i += 4) {
            newImageData.data[i] = 255;
            newImageData.data[i + 1] = 255;
            newImageData.data[i + 2] = 255;
            newImageData.data[i + 3] = 255;
        }

        const minWidth = Math.min(oldImageData.width, newImageData.width);
        const minHeight = Math.min(oldImageData.height, newImageData.height);

        for (let y = 0; y < minHeight; y++) {
            for (let x = 0; x < minWidth; x++) {
                const oldIndex = (y * oldImageData.width + x) * 4;
                const newIndex = (y * newImageData.width + x) * 4;
                newImageData.data[newIndex] = oldImageData.data[oldIndex];
                newImageData.data[newIndex + 1] = oldImageData.data[oldIndex + 1];
                newImageData.data[newIndex + 2] = oldImageData.data[oldIndex + 2];
                newImageData.data[newIndex + 3] = oldImageData.data[oldIndex + 3];
            }
        }

        ctx.putImageData(newImageData, 0, 0);

        braille = imageDataToBraille(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    function clearCanvas() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        braille = imageDataToBraille(ctx.getImageData(0, 0, canvasWidth, canvasHeight));
    }

    function fillCanvas() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        braille = imageDataToBraille(ctx.getImageData(0, 0, canvasWidth, canvasHeight));
    }

    onMount(() => {
        ctx = canvas.getContext("2d");
        clearCanvas();
    });
</script>

<div class="row">
    <div class="col">
        <div class="d-flex flex-row gap-1 mb-1">
            <div class="input-group">
                <span class="input-group-text">Dimensions</span>
                <input type="number" class="form-control" placeholder="Width" aria-label="Grid Width" step="2" min="2" bind:value={canvasWidth} style="max-width: 5em;"/>
                <span class="input-group-text">x</span>
                <input type="number" class="form-control" placeholder="Height" aria-label="Grid Height" step="4" min="4" bind:value={canvasHeight} style="max-width: 5em;"/>
                <button type="button" class="btn btn-primary" on:click={clearCanvas}>Clear</button>
                <button type="button" class="btn btn-primary" on:click={fillCanvas}>Fill</button>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <canvas width="16" height="16" bind:this={canvas}
            on:mousedown={e => e.button === 0 ? startDrawing(e, [0, 0, 0]) : startDrawing(e, [255, 255, 255])}
            on:mouseup={stopDrawing}
            on:mouseleave={stopDrawing}
            on:mousemove={draw}
            on:contextmenu={e => e.preventDefault()}>
        </canvas>
    </div>
    <div class="col">
        <pre>{braille}</pre>
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
