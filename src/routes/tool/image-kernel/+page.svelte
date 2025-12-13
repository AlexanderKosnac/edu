<script>
import { clamp } from "$lib/math.js";

import ConvolutionMask from "./ConvolutionMask.svelte";

import { activeKernel, presets } from "./stores.js";

let kernelInput;

let fileInput;
let useGraylevel = false;

let input;
let original;
let convoluted;

function loadPreset(preset) {
    $activeKernel.convolution = structuredClone(preset.matrix);
    let [width, height] = [$activeKernel.convolution[0].length, $activeKernel.convolution.length];
    $activeKernel.center = [Math.floor(width/2), Math.floor(height/2)];
    $activeKernel.dimension = [width, height];
    $activeKernel.factor = preset.factor ?? 1;
    $activeKernel.normalize = false;
}

function loadImage() {
    return new Promise((resolve) => {
        if (fileInput.files.length < 1) return resolve(false);

        const file = fileInput.files[0];
        const url = URL.createObjectURL(file);
        input.onload = () => {
            let dim = [input.naturalWidth, input.naturalHeight];
            [canvas.width, canvas.height] = dim;
            ctx.drawImage(input, 0, 0);
            resolve(true);
        };
        input.src = url;
    });
}

function applyKernel(imageData, kernel, useGraylevel = false) {
    const { width, height, data } = imageData;

    const out = new ImageData(width, height);
    const outData = out.data;

    function getIdx(x, y) {
        return (y * width + x) * 4;
    }

    function sample(x, y, fallback = [128, 128, 128]) {
        if (x < 0 || x >= width || y < 0 || y >= height)
            return fallback;

        const idx = getIdx(x, y);
        const r = data[idx];
        const g = data[idx+1];
        const b = data[idx+2];

        if (useGraylevel) {
            const grey = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            return [grey, grey, grey];
        }
        return [r, g, b];
    }

    function getConvolutedValue(x, y) {
        const acc = [0, 0, 0];

        const rows = kernel.dimension[0];
        const cols = kernel.dimension[1];
        const cy = kernel.center[0];
        const cx = kernel.center[1];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const px = x - cx + j;
                const py = y - cy + i;

                const sampleRGB = sample(px, py);
                const kVal = kernel.convolution[i][j] * kernel.factor * kernel.normFactor;

                acc[0] += kVal * sampleRGB[0];
                acc[1] += kVal * sampleRGB[1];
                acc[2] += kVal * sampleRGB[2];
            }
        }

        return acc.map(v => clamp(Math.abs(v), 0, 255));
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = getIdx(x, y);
            const rgb = getConvolutedValue(x, y);

            outData[idx]   = rgb[0];
            outData[idx+1] = rgb[1];
            outData[idx+2] = rgb[2];
            outData[idx+3] = 255;
        }
    }

    return out;
}

function run() {
    if (input.src === "")
        return;

    let dim = [input.naturalWidth, input.naturalHeight];
    [original.width, original.height] = dim;
    [convoluted.width, convoluted.height] = dim;
    [original.naturalWidth, original.naturalHeight] = dim;
    [convoluted.naturalWidth, convoluted.naturalHeight] = dim;

    const ctxOriginal = original.getContext("2d");
    const ctxConvoluted = convoluted.getContext("2d");

    ctxOriginal.drawImage(input, 0, 0);

    const imageDataOriginal = ctxOriginal.getImageData(0, 0, dim[0], dim[1]);
    const imageDataConvoluted = applyKernel(imageDataOriginal, $activeKernel, useGraylevel);
    ctxConvoluted.putImageData(imageDataConvoluted, 0, 0);
}
</script>

{#snippet matrixKernel(matrix)}
<div class="d-flex flex-column gap-1">
    {#each matrix as row, i}
    <div class="d-flex flex-row gap-1">
        {#each row as _, j}
            <span class="matrix-entry border">{matrix[j][i]}</span>
        {/each}
    </div>
    {/each}
</div>
{/snippet}

<svelte:head>
    <title>Image Kernels</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Image Kernels</h1>
    </div>
</div>

<div class="row">
    <div class="col-lg-4">
        <div class="d-flex flex-column gap-1 mb-1">
            <div class="input-group">
                <input type="file" class="form-control" id="img" name="img" accept="image/*" bind:this={fileInput} onchange={loadImage}>
            </div>
            <div class="form-check">
                <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" value="" bind:checked={useGraylevel}/>
                    Use graylevel for processing
                </label>
            </div>
            <ConvolutionMask bind:this={kernelInput}/>
            <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn btn-primary" onclick={run}>Do convolution</button>
                {#if input?.src === ""}
                <span class="text-danger">No image loaded.</span>
                {/if}
            </div>
        </div>
    </div>
    <div class="col">
        <div class="d-flex gap-1 justify-content-around">
            <img    class="image-display" bind:this={input} alt=" "/>
            <canvas class="image-display hidden" bind:this={original}></canvas>
            <canvas class="image-display" bind:this={convoluted}></canvas>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>Preset Kernels:</h2>
        <p>
            Certain kernels are well known and named. A collection of them are provided below as presets.
        </p>
        <div class="d-flex flex-row gap-3 align-items-start overflow-scroll overflow-x">
        {#each $presets as preset}
            <div class="d-flex flex-column gap-1 justify-content-center align-items-center border border-2 rounded-2 p-1">
                <button type="button" class="btn btn-dark fw-bold text-nowrap" onclick={() => loadPreset(preset)}>{preset.label}</button>
                <div class="d-flex flex-row align-items-center gap-1">
                    {#if preset.factorDisplay || preset.factor}
                        <span>{preset.factorDisplay ?? preset.factor}</span>
                    {/if}
                    {@render matrixKernel(preset.matrix)}
                </div>
            </div>
        {/each}
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Kernel_(image_processing)" target="_blank">Kernel (image processing)</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Sobel_operator" target="_blank">Sobel operator</a></li>
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
    .matrix-entry {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
    }
</style>