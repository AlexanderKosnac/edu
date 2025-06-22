<script>
    let inputRadius = 1;
    let inputLatitudeSegments = 8;
    let inputLongitudeSegments = 8;

    let objContent = "";

    function generateSphereFromInputs() {
        objContent = generateSphere(inputLatitudeSegments, inputLongitudeSegments, inputRadius);
    }

    function generateSphere(latSegments, lonSegments, radius = 1) {
        const vertices = [];
        const faces = [];

        for (let lat = 0; lat <= latSegments; lat++) {
            const theta = (lat * Math.PI) / latSegments;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let lon = 0; lon <= lonSegments; lon++) {
                const phi = (lon * 2 * Math.PI) / lonSegments;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const x = radius * cosPhi * sinTheta;
                const y = radius * cosTheta;
                const z = radius * sinPhi * sinTheta;

                vertices.push(`v ${x} ${y} ${z}`);
            }
        }

        const getIndex = (lat, lon) => lat * (lonSegments + 1) + lon + 1;

        for (let lat = 0; lat < latSegments; lat++) {
            for (let lon = 0; lon < lonSegments; lon++) {
                const a = getIndex(lat, lon);
                const b = getIndex(lat + 1, lon);
                const c = getIndex(lat + 1, lon + 1);
                const d = getIndex(lat, lon + 1);

                faces.push(`f ${a} ${b} ${c}`);
                faces.push(`f ${a} ${c} ${d}`);
            }
        }

        return [...vertices, ...faces].join('\n');
    }
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
        <textarea class="form-control font-monospace mb-1" rows="20" bind:value="{objContent}" readonly></textarea>
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