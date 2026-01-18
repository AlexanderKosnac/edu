<script>
    import { onMount } from "svelte";

    import { imageDataToBraille } from "$lib/brailleUtility.js";

    let fileInput;
    let threshold = 128;

    let outputLineHeight = 1.2;
    let lineHeightUnit = "";
    let outputFontSize = 12;
    let fontSizeUnit = "px";

    let input;
    let canvas;

    let ctx;

    let braille = "";

    let coefficients = [0.2126, 0.7152, 0.0722];
    $: sum = coefficients.reduce((psum, a) => psum + a, 0);

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

    async function braillify() {
        const ok = await loadImage();
        if (!ok) {
            alert("Failed to load image.");
            return;
        }

        braille = imageDataToBraille(
            ctx.getImageData(0, 0, canvas.width, canvas.height),
            threshold,
            coefficients
        );
    }

    onMount(() => {
        ctx = canvas.getContext("2d");
    });
</script>

<div class="row">
    <div class="col-auto">
        <div class="d-flex flex-column gap-1 mb-1">
            <div class="input-group">
                <input type="file" class="form-control" id="img" name="img" accept="image/*" bind:this={fileInput}>
            </div>

            <label for="threshold">Luminescence</label>
            <div class="input-group">
                <span class="input-group-text">Red</span>
                <input type="number" class="form-control" step="0.01" bind:value={coefficients[0]}/>

                <span class="input-group-text">Green</span>
                <input type="number" class="form-control" step="0.01" bind:value={coefficients[1]}/>

                <span class="input-group-text">Blue</span>
                <input type="number" class="form-control" step="0.01" bind:value={coefficients[2]}/>

                <span class="input-group-text">= {sum.toFixed(3)}</span>
            </div>

            <div class="input-group">
                <span class="input-group-text" title="Threshold of the brightness value considered as a visible pixel.">Threshold</span>
                <input type="number" class="form-control" id="threshold" bind:value={threshold} min="0" max="255"/>
            </div>

            <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn btn-primary" onclick={braillify}>Braillify</button>
                {#if input?.src === ""}
                    <span class="text-danger">No image loaded.</span>
                {/if}
            </div>

            <div class="input-group">
                <span class="input-group-text">Line height:</span>
                <input type="number" class="form-control" step="0.01" min="0" bind:value={outputLineHeight}/>
                <select class="form-select unitDropdown" bind:value={lineHeightUnit}>
                    <option value="">-</option>
                    <option value="px">px</option>
                    <option value="em">em</option>
                </select>

                <span class="input-group-text">Font size:</span>
                <input type="number" class="form-control" step="1" min="0" bind:value={outputFontSize}/>
                <select class="form-select unitDropdown" bind:value={fontSizeUnit}>
                    <option value="px">px</option>
                    <option value="em">em</option>
                </select>
            </div>
        </div>
    </div>
    <div class="col">
        <div class="d-flex gap-1 justify-content-around">
            <img    class="image-display hidden" bind:this={input} alt=" "/>
            <canvas class="image-display" bind:this={canvas}></canvas>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <pre style={`font-size: ${outputFontSize}${fontSizeUnit}; line-height: ${outputLineHeight}${lineHeightUnit};`}>{braille}</pre>
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
    canvas {
        border: 1px solid var(--bs-body-color);
        image-rendering: pixelated;
        image-rendering: crisp-edges;
    }
    .unitDropdown {
        max-width: 5em;
    }
</style>