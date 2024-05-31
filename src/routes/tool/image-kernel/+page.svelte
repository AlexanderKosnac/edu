<script>
import { onMount } from 'svelte';

import img from '$lib/images/animal.png';

let input;
let original;
let convoluted;

const convolution = [
    /*
    [ 0, -1,  0],
    [-1,  4, -1],
    [ 0, -1,  0],
    */
    [1,  4,  6,  4, 1],
    [4, 16, 24, 16, 4],
    [6, 24, 36, 24, 6],
    [4, 16, 24, 16, 4],
    [1,  4,  6,  4, 1],
]
const factor = 1/256;
const center = [2, 2];

function run() {
    const ctxOriginal = original.getContext("2d");
    const ctxConvoluted = convoluted.getContext("2d");

    original.width = input.width;
    convoluted.width = input.width;

    original.height = input.height;
    convoluted.height = input.height;

    ctxOriginal.drawImage(input, 0, 0);
    ctxConvoluted.drawImage(input, 0, 0);

    const imageDataOriginal = ctxOriginal.getImageData(0, 0, input.width, input.height);
    const imageDataConvoluted = ctxConvoluted.getImageData(0, 0, input.width, input.height);

    const dataOriginal = imageDataOriginal.data;
    const dataConvoluted = imageDataConvoluted.data;

    function getIdx(x, y) {
        return (y * imageDataOriginal.width + x) * 4;
    }

    function f(x, y, i, fallback) {
        return (x < 0 || x >= imageDataOriginal.width || y < 0 || y >= imageDataOriginal.height) ? fallback : dataOriginal[getIdx(x, y) + i];
    }

    function getConvolutedValue(x, y, offset) {
        const a = convolution.length;
        const b = convolution[0].length;
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

onMount(() => {
    run();
});
</script>

<div class="row">
    <div class="col">
        <h1>Image Kernels</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <img bind:this={input} src={img} alt="a"/>
        <br>
        <input type="file" id="img" name="img" accept="image/*">
        <br>
        <br>
        <div class="d-flex justify-content-around mb-1">
            <canvas bind:this={original}/>
            <canvas bind:this={convoluted}/>
        </div>
        <br>
        <button type="button" class="btn btn-primary" on:click={run}>Do convolution</button>
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
    canvas {
        aspect-ratio: 1 / 1;
        height: 40vh;
    }
</style>