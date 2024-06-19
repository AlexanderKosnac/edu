<script>
    import { createEventDispatcher } from "svelte";
    import { asHexTwoDig, hslToRgb } from "./conversions";

    export let cssColor;

    let hue = 210;
    let saturation = 80;
    let lightness = 50;

    $: {
        cssColor = `hsl(${hue} ${saturation}% ${lightness}%)`;
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

    function handleChange() {
        dispatch("change");
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