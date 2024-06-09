<script>
    export let cssColor;

    let red = 255;
    let green = 127;
    let blue = 80;

    $: {
        cssColor = `rgb(${red} ${green} ${blue})`;
    }

    export function toRgbHex() {
        return `#${parseInt(red, 16)}${parseInt(green, 16)}${parseInt(blue, 16)}`;
    }

    export function toRgb() {
        return {
            r: red,
            g: green,
            b: blue,
        }
    }
</script>

<div class="d-flex flex-column">
    <label class="form-label">
        <span class="fw-bold">Red:</span> {red}
        <input type="range" class="form-range" min="0" max="255" step="1" bind:value={red}>
    </label>

    <label class="form-label">
        <span class="fw-bold">Green:</span> {green}
        <input type="range" class="form-range" min="0" max="255" step="1" bind:value={green}>
    </label>

    <label class="form-label">
        <span class="fw-bold">Blue:</span> {blue}
        <input type="range" class="form-range" min="0" max="255" step="1" bind:value={blue}>
    </label>
</div>

<style>
    
</style>