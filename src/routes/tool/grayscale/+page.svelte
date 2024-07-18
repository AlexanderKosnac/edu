<script>
import { onMount } from "svelte";

let fileInput;

// Image and canvas elements
let input;
let original;
let convoluted;

let coefficients = [0.2126, 0.7152, 0.0722];
$: sum = coefficients.reduce((psum, a) => psum + a, 0);

let presets = [
    {
        name: "Rec. 709",
        coefficients: [0.2126, 0.7152, 0.0722],
    },
    {
        name: "Thirds",
        coefficients: [0.3333, 0.3333, 0.3333],
    },
    {
        name: "Red only",
        coefficients: [1, 0, 0],
    },
    {
        name: "Green only",
        coefficients: [0, 1, 0],
    },
    {
        name: "Blue only",
        coefficients: [0, 0, 1],
    },
    {
        name: "Rec. 601",
        coefficients: [0.299, 0.587, 0.114],
    },
    {
        name: "Rec. 2100",
        coefficients: [0.2627, 0.6780, 0.0593],
    },
]

function rgbToGraylevel(rgb) {
    return coefficients[0]*rgb[0] + coefficients[1]*rgb[1] + coefficients[2]*rgb[2];
}

function loadPreset(idx) {
    coefficients = presets[idx].coefficients;
    run();
}

function loadImage() {
    if (fileInput.files.length < 1) return;
    const file = fileInput.files[0];
    const url = URL.createObjectURL(file);
    input.src = url;

    let dim = [input.naturalWidth, input.naturalHeight];
    [original.width, original.height] = dim;
    [convoluted.width, convoluted.height] = dim;
    [original.naturalWidth, original.naturalHeight] = dim;
    [convoluted.naturalWidth, convoluted.naturalHeight] = dim;
}

function run() {
    if (input.src === "") return;

    let dim = [input.naturalWidth, input.naturalHeight];
    [original.width, original.height] = dim;
    [convoluted.width, convoluted.height] = dim;
    [original.naturalWidth, original.naturalHeight] = dim;
    [convoluted.naturalWidth, convoluted.naturalHeight] = dim;

    const ctxOriginal = original.getContext("2d");
    const ctxConvoluted = convoluted.getContext("2d");

    ctxOriginal.drawImage(input, 0, 0);

    const imageDataOriginal = ctxOriginal.getImageData(0, 0, dim[0], dim[1]);
    const imageDataConvoluted = ctxConvoluted.getImageData(0, 0, dim[0], dim[1]);

    function getIdx(x, y) {
        return (y * imageDataOriginal.width + x) * 4;
    }

    function castPixel(idx) {
        const rgb = imageDataOriginal.data.slice(idx, idx+3);
        const gray = rgbToGraylevel(rgb);
        return [gray, gray, gray];
    }

    for (let y=0; y<imageDataConvoluted.height; y++) {
        for (let x=0; x<imageDataConvoluted.width; x++) {
            const idx = getIdx(x, y);
            const conv = castPixel(idx);
            imageDataConvoluted.data[idx+0] = conv[0];
            imageDataConvoluted.data[idx+1] = conv[1];
            imageDataConvoluted.data[idx+2] = conv[2];
            imageDataConvoluted.data[idx+3] = 255;
        }
    }

    ctxConvoluted.putImageData(imageDataConvoluted, 0, 0);
}

onMount(() => {
    loadImage();
});
</script>

<svelte:head>
    <title>Grayscale</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Grayscale</h1>
    </div>
</div>

<div class="row">
    <div class="col-lg-4">
        <div class="d-flex flex-column gap-1 mb-1">
            <div class="input-group">
                <input type="file" class="form-control" id="img" name="img" accept="image/*" bind:this={fileInput} on:change={loadImage}>
            </div>
            <div class="d-flex align-items-center">
                <div class="input-group">
                    <span class="input-group-text">Red</span>
                    <input type="number" class="form-control" step="0.01" bind:value={coefficients[0]}/>

                    <span class="input-group-text">Green</span>
                    <input type="number" class="form-control" step="0.01" bind:value={coefficients[1]}/>

                    <span class="input-group-text">Blue</span>
                    <input type="number" class="form-control" step="0.01" bind:value={coefficients[2]}/>

                    <span class="input-group-text">= {sum.toFixed(3)}</span>
                </div>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn btn-primary" on:click={run}>Cast to Graylevel</button>
                {#if input?.src === ""}
                <span class="text-danger">No image loaded.</span>
                {/if}
            </div>
            <div>
                <h2>Presets</h2>
                <ul>
                    {#each presets as preset, idx}
                    <li><input type="button" class="btn btn-link" on:click={() => loadPreset(idx)} value={preset.name}/> [{preset.coefficients.join(", ")}]</li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
    <div class="col">
        <div class="d-flex gap-1 justify-content-around">
            <img    class="image-display" bind:this={input} alt=" "/>
            <canvas class="image-display hidden" bind:this={original}/>
            <canvas class="image-display" bind:this={convoluted}/>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Grayscale" target="_blank">Grayscale</a></li>
        </ul>
    </div>
</div>

<style>
    .image-display {
        max-width: 40%;
        width: 40%;
    }
    .hidden {
        display: none;
    }
</style>