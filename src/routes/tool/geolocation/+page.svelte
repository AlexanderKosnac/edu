<script>
    import { onMount } from "svelte";

    let options = {
        maximumAge: 0,
        timeout: 5000,
        enableHighAccuracy: true,
    }

    let formats = [
        {
            name: "Decimal degrees (DD)",
            html: (degree) => `${degree}&deg;`,
        },
        {
            name: "Degrees, minutes, seconds (DMS)",
            html: (degree) => {
                const ddg = decimalDegreesToDegreesMinutesSeconds(degree);
                return `${ddg.deg}&deg; ${ddg.min}&prime; ${ddg.sec.toFixed(3)}&Prime;`;
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
        const deg = Math.floor(degree)
        const min = Math.floor((degree - deg) * 60)
        const sec = ((degree - deg) * 60 - min) * 60
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
        <div class="d-flex flex-row gap-2 align-items-center">
            <button type="button" class="btn btn-sm btn-primary" onclick={updateLocation}>Fetch</button>
            {#each formats as format}
                <label>
                    <input type="radio" class="form-check-input" value={format} bind:group={selectedFormat}/>
                    {format.name}
                </label>
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        {#await locationPromise}
            Locating ...
        {:then value}
            {#if value}
                Time: {new Date(value.timestamp)}<br>
                Latitude: {@html selectedFormat.html(value.coords.latitude)} (&#177; {value.coords.accuracy ?? "N/A"}m)<br>
                Longitude: {@html selectedFormat.html(value.coords.longitude)} (&#177; {value.coords.accuracy ?? "N/A"}m)<br>
                Altitude: {value.coords.altitude}m (&#177; {value.coords.accuracyAltitude ?? "N/A"}m)<br>
                Speed: {value.coords.speed ?? "N/A"} m/s; Heading: {value.coords.heading ?? "N/A"}
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