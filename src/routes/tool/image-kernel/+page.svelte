<script>
import ConvolutionMask from "./ConvolutionMask.svelte";
import Matrix from "./Matrix.svelte";

import { presets } from "./presets"

let convolution = [
    [ 0, -1,  0],
    [-1,  5, -1],
    [ 0, -1,  0],
];

let center = [1, 1];
let dimension = [3, 3];
let factor = 1;
let normalization = 1;

let fileInput;
let matrixInput;
let input;
let original;
let convoluted;

function loadImage() {
    if (fileInput.files.length < 1) return;
    const file = fileInput.files[0];
    const url = URL.createObjectURL(file);
    input.src = url;
}

function loadPreset(matrix) {
    convolution = matrix;
    let [length, width] = [matrix.length, matrix[0].length];
    center = [Math.floor(length/2), Math.floor(width/2)];
    dimension = [length, width];
    factor = 1;
}

function run() {
    if (input.src === "") return;

    const ctxOriginal = original.getContext("2d");
    const ctxConvoluted = convoluted.getContext("2d");

    let dim = [input.width, input.height];
    [original.style.width, original.style.height] = dim;
    [convoluted.style.width, convoluted.style.height] = dim;
    [original.width, original.height] = dim;
    [convoluted.width, convoluted.height] = dim;

    ctxOriginal.drawImage(input, 0, 0);
    ctxConvoluted.drawImage(input, 0, 0);

    const imageDataOriginal = ctxOriginal.getImageData(0, 0, dim[0], dim[1]);
    const imageDataConvoluted = ctxConvoluted.getImageData(0, 0, dim[0], dim[1]);

    const dataOriginal = imageDataOriginal.data;
    const dataConvoluted = imageDataConvoluted.data;

    function getIdx(x, y) {
        return (y * imageDataOriginal.width + x) * 4;
    }

    function f(x, y, i, fallback) {
        return (x < 0 || x >= imageDataOriginal.width || y < 0 || y >= imageDataOriginal.height) ? fallback : dataOriginal[getIdx(x, y) + i];
    }

    function getConvolutedValue(x, y, offset) {
        const a = dimension[0];
        const b = dimension[1];
        let acc = 0;
        for (let i=0; i<a; i++) {
            for (let j=0; j<b; j++) {
                acc += factor * normalization * convolution[j][i] * f(x+j-center[0], y+i-center[1], offset, 128);
            }
        }
        return clamp(acc, 0, 255);
    }

    for (let y=0; y<imageDataConvoluted.height; y++) {
        for (let x=0; x<imageDataConvoluted.width; x++) {
            const i = getIdx(x, y);
            dataConvoluted[i+0] = getConvolutedValue(x, y, 0);
            dataConvoluted[i+1] = getConvolutedValue(x, y, 1);
            dataConvoluted[i+2] = getConvolutedValue(x, y, 2);
            dataConvoluted[i+3] = 255;
        }
    }

    ctxConvoluted.putImageData(imageDataConvoluted, 0, 0);
}

function clamp(value, lower, upper) {
    if (value < lower) return lower;
    if (value > upper) return upper;
    return value;
}
</script>

<div class="row">
    <div class="col">
        <h1>Image Kernels</h1>
    </div>
</div>

<div class="row">
    <div class="col-lg-4">
        <div class="d-flex flex-column gap-1 mb-1">
            <div class="input-group">
                <button class="btn btn-primary text-nowrap" type="button" id="inputGroupFileAddon03" on:click={loadImage}>Load Image</button>
                <input type="file" class="form-control" id="img" name="img" accept="image/*" bind:this={fileInput}>
            </div>
            <ConvolutionMask bind:this={matrixInput} bind:matrix={convolution} bind:center={center} bind:dimension={dimension} bind:factor={factor} bind:normalization={normalization}/>
            <button type="button" class="btn btn-primary" on:click={run}>Do convolution</button>
        </div>
    </div>
    <div class="col">
        {#if input?.src === ""}
            No image loaded.
        {/if}

        <div class="d-flex gap-1 justify-content-around">
            <img bind:this={input} alt=""/>
            <canvas bind:this={original} style="display: none"/>
            <canvas bind:this={convoluted}/>
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
        {#each presets as preset}
            <div class="d-flex flex-column gap-1 justify-content-center align-items-center border border-2 rounded-2 p-1">
                <button type="button" class="btn btn-dark fw-bold" on:click={() => loadPreset(preset.matrix)}>{preset.label}</button>
                <Matrix matrix={preset.matrix}/>
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
</style>