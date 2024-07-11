<script>
    import { createEventDispatcher } from "svelte";
    import { asHexTwoDig, rgbToHsl, cmykToRgb } from "./conversions";

    let cyan = 0.85;
    let magenta = 0.00;
    let yellow = 0.65;
    let black = 0.09;

    export function getCssColor() {
        let rgb = toRgb();
        return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
    }

    export function toRgbHex() {
        const rgb = toRgb();
        return `#${asHexTwoDig(rgb.r)}${asHexTwoDig(rgb.g)}${asHexTwoDig(rgb.b)}`;
    }

    export function toRgb() {
        return cmykToRgb(toCmyk());
    }

    export function toHsl() {
        return rgbToHsl(toRgb());
    }

    export function toCmyk() {
        return {
            c: cyan,
            m: magenta,
            y: yellow,
            k: black,
        };
    }

    const dispatch = createEventDispatcher();

    function handleInput() {
        dispatch("input");
    }
</script>

<div class="d-flex flex-column">
    <label class="form-label">
        <span class="fw-bold">Cyan:</span> {cyan.toFixed(2)}
        <input type="range" class="form-range" min="0" max="1" step="0.01" bind:value={cyan} on:change={handleInput}>
    </label>

    <label class="form-label">
        <span class="fw-bold">Magenta:</span> {magenta.toFixed(2)}
        <input type="range" class="form-range" min="0" max="1" step="0.01" bind:value={magenta} on:change={handleInput}>
    </label>

    <label class="form-label">
        <span class="fw-bold">Yellow:</span> {yellow.toFixed(2)}
        <input type="range" class="form-range" min="0" max="1" step="0.01" bind:value={yellow} on:change={handleInput}>
    </label>

    <label class="form-label">
        <span class="fw-bold">Black:</span> {black.toFixed(2)}
        <input type="range" class="form-range" min="0" max="1" step="0.01" bind:value={black} on:change={handleInput}>
    </label>
</div>

<style>
</style>