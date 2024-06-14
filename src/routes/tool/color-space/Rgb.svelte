<script>
    import { createEventDispatcher } from "svelte";
    import { rgbToHsl } from "./conversions";

    export let cssColor;

    let red = 255;
    let green = 127;
    let blue = 80;

    $: {
        cssColor = `rgb(${red} ${green} ${blue})`;
    }

    export function toRgbHex() {
        const asHex = i => i.toString(16).padStart(length, "0").toUpperCase();
        return `#${asHex(red)}${asHex(green)}${asHex(blue)}`;
    }

    export function toRgb() {
        return {
            r: red,
            g: green,
            b: blue,
        }
    }

    export function toHsl() {
        return rgbToHsl(toRgb());
    }

    const dispatch = createEventDispatcher();

    function handleChange() {
        dispatch("change");
    }
</script>

<div class="d-flex flex-column">
    <label class="form-label">
        <span class="fw-bold">Red:</span> {red}
        <input type="range" class="form-range" min="0" max="255" step="1" bind:value={red} on:change={handleChange}>
    </label>

    <label class="form-label">
        <span class="fw-bold">Green:</span> {green}
        <input type="range" class="form-range" min="0" max="255" step="1" bind:value={green} on:change={handleChange}>
    </label>

    <label class="form-label">
        <span class="fw-bold">Blue:</span> {blue}
        <input type="range" class="form-range" min="0" max="255" step="1" bind:value={blue} on:change={handleChange}>
    </label>
</div>

<style>
    
</style>