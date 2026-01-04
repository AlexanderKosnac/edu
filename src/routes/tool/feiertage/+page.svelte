<script>
    import { get } from "$lib/apiRestUtility";

    function getYear(year) {
        return get("https://feiertage-api.de/api/", { jahr: 1940 })
    }

    $: promise = getYear(1999);
</script>

<svelte:head>
    <title>Feiertage</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Feiertage</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        {#await promise}
            <div>Request pending</div>
        {:then value}
            <pre>{JSON.stringify(value, null, 2)}</pre>
        {:catch error}
            <div>Something went wrong: {error.message}</div>
        {/await}
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://feiertage-api.de/" target="_blank">feiertage-api.de</a></li>
            <li><a href="https://de.wikipedia.org/wiki/Feiertag_(Deutschland)" target="_blank">Feiertage on Wikipedia</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Public_holidays_in_Germany" target="_blank">Public holidays in Germany on Wikipedia</a></li>
        </ul>
    </div>
</div>

<style>
</style>