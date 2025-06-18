<script>
    import { onMount } from "svelte";

    let inputRadius = 1;
    let inputLatitudeSegments = 8;
    let inputLongitudeSegments = 8;

    let objContent = "";

    function generateSphereFromInputs() {
        objContent = generateSphere(inputRadius, inputLatitudeSegments, inputLongitudeSegments);
    }

    function generateSphere(radius = 1, latSegments = 18, lonSegments = 36) {
        return [];
    }

    onMount(() => {
    });
</script>

<svelte:head>
    <title>Sphere Generator</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Sphere Generator</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto d-flex flex-column gap-1">
        <label>
            Radius:
            <input type="number" class="form-control" bind:value={inputRadius}
                step="0.01" min="0.01"
                aria-label="Sphere radius input"/>
        </label>
        <label>
            Number of latitute segments:
            <input type="number" class="form-control" bind:value={inputLatitudeSegments}
                step="1" min="1"
                aria-label="Ticks per second"/>
        </label>
        <label>
            Number of longitude segments:
            <input type="number" class="form-control" bind:value={inputLongitudeSegments}
                step="1" min="1"
                aria-label="Ticks per second"/>
        </label>

        <button type="button" class="btn btn-sm btn-primary" on:click={generateSphereFromInputs}>Generate</button>
    </div>
    <div class="col">
        <textarea class="form-control font-monospace mb-1" rows="20" bind:value="{objContent}"></textarea>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://de.wikipedia.org/wiki/Wavefront_OBJ" target="_blank">Wavefront OBJ</a></li>
        </ul>
    </div>
</div>

<style>
</style>