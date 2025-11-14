<script>
    import { onMount } from "svelte";

    import { imageDataToBraille } from "$lib/brailleUtility.js";

    let canvasWidth = 16;
    let canvasHeight = 16;

    let canvas;

    let ctx;
    let imageData;

    $: braille = imageData ? imageDataToBraille(imageData) : "";

        return output;
    }

    function setPixel(x, y, r, g, b) {
        const index = (y * canvas.width + x) * 4;
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255;
    }

    function setPixelOnClick(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);
        setPixel(x, y, 0, 0, 0);
        ctx.putImageData(imageData, 0, 0);
    }

    function clearPixelOnClick(e) {

    }

    function clearCanvas() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    onMount(()=> {
        ctx = canvas.getContext("2d");
        clearCanvas();
    });
</script>

<svelte:head>
    <title>Draw braille</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Draw braille</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <canvas width="{canvasWidth}" height="{canvasHeight}"
            bind:this={canvas}
            onclick={setPixelOnClick}
            oncontextmenu={clearPixelOnClick}>
        </canvas>
    </div>
    <div class="col">
        <button type="button" class="btn btn-secondary" onclick={clearCanvas}>Clear</button>
    </div>
</div>

<div class="row">
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
        width: 400px;
        height: 400px;
        border: 1px solid var(--bs-body-color)
    }
</style>