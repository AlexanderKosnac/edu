<script>
import { onMount } from 'svelte';

import ConvolutionMask from './ConvolutionMask.svelte';

let convolution = [
    [ 0, -1,  0],
    [-1,  5, -1],
    [ 0, -1,  0],
];

let center = [1, 1];
let dimension = [3, 3];
let factor = 1;

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

function run() {
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
                acc += factor * convolution[i][j] * f(x+i-center[0], y+j-center[1], offset, 128);
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
    <div class="col-4">
        <div class="d-flex flex-column gap-1">
            <div class="d-flex gap-1 align-items-center">
                <button type="button" class="btn btn-primary text-nowrap" on:click={loadImage}>Load Image</button>
                <input type="file" id="img" name="img" accept="image/*" bind:this={fileInput}>
            </div>
            <ConvolutionMask bind:this={matrixInput} bind:matrix={convolution} bind:center={center} bind:dimension={dimension} bind:factor={factor}/>
            <button type="button" class="btn btn-primary" on:click={run}>Do convolution</button>
        </div>
    </div>
    <div class="col">
        <div class="d-flex gap-1">
            <img bind:this={input} alt=""/>
            <canvas bind:this={original} style="display: none"/>
            <canvas bind:this={convoluted}/>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Kernel_(image_processing)" target="_blank">Kernel (image processing)</a></li>
        </ul>
    </div>
</div>

<style>
</style>