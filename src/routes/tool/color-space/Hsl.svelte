<script>
    import { createEventDispatcher } from "svelte";
    import { asHexTwoDig, hslToRgb, rgbToCmyk } from "./conversions";

    let hue = 210;
    let saturation = 0.80;
    let lightness = 0.50;

    export function getCssColor() {
        return `hsl(${hue} ${saturation*100} ${lightness*100})`;
    }

    export function toRgbHex() {
        const rgb = toRgb();
        return `#${asHexTwoDig(rgb.r)}${asHexTwoDig(rgb.g)}${asHexTwoDig(rgb.b)}`;
    }

    export function toRgb() {
        return hslToRgb(toHsl());
    }

    export function toHsl() {
        return {
            h: hue,
            s: saturation,
            l: lightness,
        };
    }

    export function toCmyk() {
        return rgbToCmyk(toRgb());
    }

    const dispatch = createEventDispatcher();

    function handleInput() {
        dispatch("input");
    }
</script>

<div class="d-flex flex-column">
    <label class="form-label">
        <span class="fw-bold">Hue:</span> {hue}°
        <input type="range" class="form-range" min="0" max="360" step="1" bind:value={hue} on:change={handleInput}>
    </label>

    <label class="form-label">
        <span class="fw-bold">Saturation:</span> {saturation.toFixed(2)}
        <input type="range" class="form-range" min="0" max="1" step="0.01" bind:value={saturation} on:change={handleInput}>
    </label>

    <label class="form-label">
        <span class="fw-bold">Lightness:</span> {lightness.toFixed(2)}
        <input type="range" class="form-range" min="0" max="1" step="0.01" bind:value={lightness} on:change={handleInput}>
    </label>
</div>

<style>
</style>