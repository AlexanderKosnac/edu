<script>
    import Display from "./Display.svelte";
    import Rgb from "./Rgb.svelte";
    import Hsl from "./Hsl.svelte";

    const values = [
		{ label: "RGB", component: Rgb },
		{ label: "HSL", component: Hsl },
	];

	let selected = values[0];
    let colorInput = {
        toRgbHex: () => "#000000",
        toRgb: () => { return { r: 0, g: 0, b: 0 } },
        toHsl: () => { return { h: 0, s: 0, l: 0 } },
    };
    let cssColor = "";

    function updateColorInput() {
       colorInput = colorInput;
    }

    let hex, rgb, hsl;
    $: {
        hex = colorInput.toRgbHex();
        rgb = colorInput.toRgb();
        hsl = colorInput.toHsl();
    };
</script>

<svelte:head>
    <title>Color space</title> 
</svelte:head>

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
        <svelte:component this={selected.component} bind:this={colorInput} bind:cssColor={cssColor} on:change={updateColorInput}></svelte:component>
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
            <Display name="RGB" values={[
                ["Hex", hex],
                ["Red", rgb.r],
                ["Green", rgb.g],
                ["Blue", rgb.b],
            ]}/>

            <Display name="HSL" values={[
                ["Hue", hsl.h.toFixed(2), "°"],
                ["Saturation", hsl.s.toFixed(2), "%"],
                ["Lightness", hsl.l.toFixed(2), "%"],
            ]}/>
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