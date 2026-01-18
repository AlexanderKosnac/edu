<script>
    import { katexAsHtml } from "$lib/katexUtility.js";

    const radiusKmEarth = 6371.2;

    function haversineDistance(lat1, lon1, lat2, lon2, radiusKm = radiusKmEarth) {
        const toRad = (deg) => (deg * Math.PI) / 180;

        const phi1 = toRad(lat1);
        const phi2 = toRad(lat2);
        const deltaPhi = toRad(lat2 - lat1);
        const deltaLambda = toRad(lon2 - lon1);

        const sinDeltaPhi = Math.sin(deltaPhi / 2);
        const sinDeltaLambda = Math.sin(deltaLambda / 2);
        const a = sinDeltaPhi ** 2 + Math.cos(phi1) * Math.cos(phi2) * sinDeltaLambda ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = radiusKm * c;

        const katex = `
\\begin{array}{l}
    \\text{Inputs: }
    R = ${radiusKm} \\text{ km}, P_1(${lat1}, ${lon1}), P_2(${lat2}, ${lon2}) \\\\[2mm]

    \\Delta \\phi = \\phi_2 - \\phi_1 = ${lat2}^\\circ - ${lat1}^\\circ = ${(lat2 - lat1).toFixed(6)}^\\circ = ${deltaPhi.toFixed(6)} \\text{ rad} \\\\
    \\Delta \\lambda = \\lambda_2 - \\lambda_1 = ${lon2}^\\circ - ${lon1}^\\circ = ${(lon2 - lon1).toFixed(6)}^\\circ = ${deltaLambda.toFixed(6)} \\text{ rad} \\\\[2mm]

    a = \\sin^2(\\frac{\\Delta \\phi}{2}) + \\cos(\\phi_1) \\cdot \\cos(\\phi_2) \\cdot \\sin^2(\\frac{\\Delta \\lambda}{2}) \\\\
    \\quad = ${sinDeltaPhi.toFixed(6)}^2 + ${Math.cos(phi1).toFixed(6)} \\cdot ${Math.cos(phi2).toFixed(6)} \\cdot ${sinDeltaLambda.toFixed(6)}^2 \\\\
    \\quad = ${a.toFixed(6)} = \\operatorname{hav} \\theta \\\\[2mm]

    c = 2 \\cdot \\arctan2(\\sqrt{a}, \\sqrt{1-a}) = ${c.toFixed(6)} \\\\[2mm]

    \\text{Distance } = R \\cdot c = ${radiusKm} \\cdot ${c.toFixed(6)} = ${distance.toFixed(2)} \\text{ km}
\\end{array}`;

        return { distance, katex };
    }

    let point1Lat = 38.898;
    let point1Lon = -77.037;
    let point2Lat = 48.858;
    let point2Lon = 2.294;

    $: distance = haversineDistance(point1Lat, point1Lon, point2Lat, point2Lon, radiusKmEarth);
</script>

<svelte:head>
    <title>Haversine formula</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Haversine formula</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <div class="d-flex flex-column gap-1">
            <strong>Point 1:</strong>
            <div>
                <label>
                    Latitude:
                    <input type="number" class="form-control" bind:value={point1Lat} min="-90" max="90" step="0.1" />
                </label>
                <label>
                    Longitude:
                    <input type="number" class="form-control" bind:value={point1Lon} min="-180" max="180" step="0.1" />
                </label>
            </div>

            <strong>Point 2:</strong>
            <div>
                <label>
                    Latitude:
                    <input type="number" class="form-control" bind:value={point2Lat} min="-90" max="90" step="0.1" />
                </label>
                <label>
                    Longitude:
                    <input type="number" class="form-control" bind:value={point2Lon} min="-180" max="180" step="0.1" />
                </label>
            </div>
        </div>
        <div>
            Distance: {distance.distance.toFixed(2)}km
        </div>
    </div>
    <div class="col">
        {@html katexAsHtml(distance.katex)}
    </div>

    <div class="col">
        {#if browser}
            <div bind:this={globeContainer} style="width: 100%; height: 500px;"></div>
        {/if}
    </div>
</div>

<style>
    input[type="number"] {
        width: 10em;
    }
</style>
