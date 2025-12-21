<script>
    import { onMount } from "svelte";

    import MapLinks from "$lib/MapLinks/MapLinks.svelte";

    const options = {
        maximumAge: 0,
        timeout: 5000,
        enableHighAccuracy: true,
    }

    const formats = [
        {
            name: "Decimal degrees (DD)",
            html: (degree, positive, negative) => {
                const sign = degree > 0 ? positive : negative;
                return `${degree}&deg; ${sign}`;
            },
        },
        {
            name: "Degrees, minutes, seconds (DMS)",
            html: (degree, positive, negative) => {
                const ddg = decimalDegreesToDegreesMinutesSeconds(degree);
                const sign = degree > 0 ? positive : negative;
                return `${ddg.deg}&deg; ${ddg.min}&prime; ${ddg.sec.toFixed(3)}&Prime; ${sign}`;
            },
        },
    ];

    let locationPromise;

    let selectedFormat = formats[0];

    function getCurrentPositionAsync(options) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    function decimalDegreesToDegreesMinutesSeconds(degree) {
        const abs = Math.abs(degree);
        const deg = Math.floor(abs);
        const minFloat = (abs - deg) * 60;
        const min = Math.floor(minFloat);
        const sec = (minFloat - min) * 60;
        return { deg, min, sec };
    }

    function updateLocation() {
        locationPromise = getCurrentPositionAsync(options);
    }

    onMount(() => {
        updateLocation();
    });
</script>

<svelte:head>
    <title>Geolocation</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Geolocation</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <div class="d-flex flex-row gap-2 align-items-end">
            <button type="button" class="btn btn btn-primary" onclick={updateLocation}>Fetch</button>

            <label class="d-flex align-items-center gap-1">
                Maximum Age:
                <input type="number" class="form-control" bind:value={options.maximumAge} min="0" style="max-width: 150px;"/>
            </label>

            <label class="d-flex align-items-center gap-1">
                Timeout:
                <input type="number" class="form-control" bind:value={options.timeout} min="0" style="max-width: 150px;"/>
            </label>

            <label class="align-self-center">
                <input type="checkbox" class="form-check-input" aria-label="High Accuracy" bind:checked={options.enableHighAccuracy}/>
                High Accuracy
            </label>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        {#await locationPromise}
            Locating ...
        {:then value}
            {#if value}
                <table class="table table-bordered w-auto mt-1">
                    <tbody>
                        <tr>
                            <td>Time:</td>
                            <td colspan="2">{new Date(value.timestamp)}</td>
                        </tr>
                        <tr>
                            <td>Latitude:</td>
                            <td>{@html selectedFormat.html(value.coords.latitude, "N", "S")} (&#177; {value.coords.accuracy ?? "N/A"}m)</td>
                            <td rowspan="2" style="vertical-align: middle;">
                                <div class="d-flex flex-column gap-1">
                                    {#each formats as format}
                                        <label>
                                            <input type="radio" class="form-check-input" value={format} bind:group={selectedFormat}/>
                                            {format.name}
                                        </label>
                                    {/each}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Longitude:</td>
                            <td>{@html selectedFormat.html(value.coords.longitude, "E", "W")} (&#177; {value.coords.accuracy ?? "N/A"}m)</td>
                        </tr>
                        <tr>
                            <td>Altitude:</td>
                            <td colspan="2">{value.coords.altitude ?? "N/A"}m (&#177; {value.coords.accuracyAltitude ?? "N/A"}m)</td>
                        </tr>
                        <tr>
                            <td>Speed:</td>
                            <td colspan="2">{value.coords.speed ?? "N/A"} m/s; Heading: {value.coords.heading ?? "N/A"}</td>
                        </tr>
                        <tr>
                            <td>Viewer Links:</td>
                            <td colspan="2"><MapLinks latitude={value.coords.latitude} longitude={value.coords.longitude} /></td>
                        </tr>
                    </tbody>
                </table>
            {/if}
        {:catch error}
            <span class="text-danger">Failed to fetch location. {error.message}</span>
        {/await}
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API" target="_blank">Geolocation API</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Geographic_coordinate_system" target="_blank">Geographic coordinate system</a></li>
        </ul>
    </div>
</div>

<style>
</style>