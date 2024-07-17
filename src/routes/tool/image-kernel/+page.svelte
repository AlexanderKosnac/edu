<script>
import { onMount } from "svelte";

import { clamp } from "$lib/math.js";

import ConvolutionMask from "./ConvolutionMask.svelte";
import Matrix from "./Matrix.svelte";

import { activeKernel, presets } from "./stores.js";

let kernelInput;

let fileInput;
let useGraylevel = false;

// Image and canvas elements
let input;
let original;
let convoluted;

function loadPreset(preset) {
    $activeKernel.convolution = preset.matrix;
    let [width, length] = [$activeKernel.convolution[0].length, $activeKernel.convolution.length];
    $activeKernel.center = [Math.floor(width/2), Math.floor(length/2)];
    $activeKernel.dimension = [width, length];
    $activeKernel.factor = preset.factor ?? 1;
    $activeKernel.normalize = false;
}

function loadImage() {
    if (fileInput.files.length < 1) return;
    const file = fileInput.files[0];
    const url = URL.createObjectURL(file);
    input.src = url;
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

    function f(x, y, fallback) {
        if (x < 0 || x >= imageDataOriginal.width || y < 0 || y >= imageDataOriginal.height) return fallback;
        const idx = getIdx(x, y);
        const rgb = imageDataOriginal.data.slice(idx, idx+3);
        if (useGraylevel) {
            let grey = 0.2126*rgb[0] + 0.7152*rgb[1] + 0.0722*rgb[2];
            return [grey, grey, grey];
        } else {
            return rgb;
        }
    }

    function getConvolutedValue(x, y) {
        let acc = [0, 0, 0];
        const xc = x - $activeKernel.center[1];
        const yc = y - $activeKernel.center[0];
        for (let i=0; i<$activeKernel.dimension[0]; i++) {
            for (let j=0; j<$activeKernel.dimension[1]; j++) {
                f(xc+j, yc+i, [128, 128, 128]).forEach((v, idx) => {
                    acc[idx] += $activeKernel.factor * $activeKernel.normFactor * $activeKernel.convolution[j][i] * v;
                });
            }
        }
        return acc.map(i => clamp(i, 0, 255));
    }

    for (let y=0; y<imageDataConvoluted.height; y++) {
        for (let x=0; x<imageDataConvoluted.width; x++) {
            const i = getIdx(x, y);
            const conv = getConvolutedValue(x, y);
            imageDataConvoluted.data[i+0] = conv[0]
            imageDataConvoluted.data[i+1] = conv[1];
            imageDataConvoluted.data[i+2] = conv[2];
            imageDataConvoluted.data[i+3] = 255;
        }
    }

    ctxConvoluted.putImageData(imageDataConvoluted, 0, 0);
}

onMount(() => {
    loadImage();
});
</script>

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
                <input type="file" class="form-control" id="img" name="img" accept="image/*" bind:this={fileInput} on:change={loadImage}>
            </div>
            <div class="form-check">
                <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" value="" bind:checked={useGraylevel}>
                    Use graylevel for processing
                </label>
            </div>
            <ConvolutionMask bind:this={kernelInput}/>
            <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn btn-primary" on:click={run}>Do convolution</button>
                {#if input?.src === ""}
                <span class="text-danger">No image loaded.</span>
                {/if}
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
        <h2>Preset Kernels:</h2>
        <p>
            Certain kernels are well known and named. A collection of them are provided below as presets.
        </p>
        <div class="d-flex flex-row gap-3 align-items-start">
        {#each $presets as preset}
            <div class="d-flex flex-column gap-1 justify-content-center align-items-center border border-2 rounded-2 p-1">
                <button type="button" class="btn btn-dark fw-bold" on:click={() => loadPreset(preset)}>{preset.label}</button>
                <div class="d-flex flex-row align-items-center gap-1">
                    {#if preset.factorDisplay || preset.factor}
                        <span>{preset.factorDisplay ?? preset.factor}</span>
                    {/if}
                    <Matrix matrix={preset.matrix}/>
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
</style>