<script>
    import { onMount } from "svelte";

    function getCurrentPositionAsync(options) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    let locationPromise;

    let options = {
        maximumAge: 0,
        timeout: 5000,
        enableHighAccuracy: true,
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
        <button type="button" class="btn btn-sm btn-primary" on:click={updateLocation}>Fetch</button>
    </div>
    <div class="col">
        {#await locationPromise}
            Locating ...
        {:then value}
            {#if value}
                Time: {new Date(value.timestamp)}<br>
                Latitude: {value.coords.latitude}° (&#177; {value.coords.accuracy ?? "N/A"}m)<br>
                Longitude: {value.coords.longitude}° (&#177; {value.coords.accuracy ?? "N/A"}m)<br>
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
        </ul>
    </div>
</div>

<style>
</style>