<script>
    import { createEventDispatcher } from "svelte";

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

    const dispatch = createEventDispatcher();

    function handleInput() {
        dispatch("input");
    }
</script>

<div class="d-flex flex-column">
    <label class="form-label">
        <span class="fw-bold">Hue:</span> {hue}°
        <input type="range" class="form-range" min="0" max="360" step="1" bind:value={hue} on:change={handleChange}>
    </label>

    <label class="form-label">
        <span class="fw-bold">Saturation:</span> {saturation}%
        <input type="range" class="form-range" min="0" max="100" step="1" bind:value={saturation} on:change={handleChange}>
    </label>

    <label class="form-label">
        <span class="fw-bold">Lightness:</span> {lightness}%
        <input type="range" class="form-range" min="0" max="100" step="1" bind:value={lightness} on:change={handleChange}>
    </label>
</div>

<style>
</style>