<script>
    import Rgb from "./Rgb.svelte";

    const values = [
		{ label: "RGB", component: Rgb },
	];

	let selected = values[0];
    let colorInput = {
        toRgbHex: () => "#??????",
        toRgb: () => { return { r: 0, g: 0, b: 0 } },
    };
    let cssColor = "";
</script>
    
<div class="row">
    <div class="col">
        <h1>Color space</h1>
    </div>
</div>

<div class="row">
    <div class="col-sm">
        <div class="d-flex gap-1 mb-3">
            {#each values as value}
            <div class="form-check form-check-inline">
                <label class="form-check-label">
                    <input class="form-check-input" type="radio" bind:group={selected} value={value}>
                    {value.label}
                </label>
            </div>
            {/each}
        </div>
        <svelte:component this={selected.component} bind:this={colorInput} bind:cssColor={cssColor}></svelte:component>
    </div>
    <div class="col-sm d-flex justify-content-center">
        <svg class="border" width="200" height="200">
            <rect width="200" height="200" fill={cssColor}></rect>
        </svg>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="d-flex gap-1">
            <div class="d-flex flex-column border p-1">
                <span class="fw-bold">RGB</span>
                Hex: {colorInput.toRgbHex()}<br>
                Red: {colorInput.toRgb().r}<br>
                Green: {colorInput.toRgb().g}<br>
                Blue: {colorInput.toRgb().b}<br>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Color_space" target="_blank">Color space</a></li>
            <li><a href="https://en.wikipedia.org/wiki/List_of_color_spaces_and_their_uses" target="_blank">List of color spaces and their uses</a></li>
        </ul>
    </div>
</div>

<style>
</style>