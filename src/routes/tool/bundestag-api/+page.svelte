<script>
    import { onMount } from "svelte";

    import { vorgang, vorgangsposition, drucksache, drucksacheText, plenarprotokoll, plenarprotokollText, aktivitaet, person } from "$lib/apiBundestag";

    const allEndpoints = [
        { label: "Vorgang", obj: vorgang },
        { label: "Vorgangsposition", obj: vorgangsposition },
        { label: "Drucksache", obj: drucksache },
        { label: "Drucksache Text", obj: drucksacheText },
        { label: "Plenarprotokoll", obj: plenarprotokoll },
        { label: "Plenarprotokoll Text", obj: plenarprotokollText },
        { label: "Aktivität", obj: aktivitaet },
        { label: "Person", obj: person },
    ];

    let selectedEndpoint = allEndpoints[0];
    let id = 1;

    let promise = Promise.resolve(null);

    function query() {
        promise = selectedEndpoint.obj.getById(id);
    }

    onMount(() => {
        query();
    });
</script>

<div class="row">
    <div class="col">
        <div class="alert alert-info" role="alert">This page relies on API calls through a CORS proxy. If the proxy is overloaded, it may not work properly. Please come back later.</div>
    </div>
</div>

<div class="row">
    <div class="col"></div>
    <div class="input-group mb-3">
        <label class="input-group-text" for="endpointSelect">Endpoint:</label>
        <select id="endpointSelect" class="form-select" bind:value={selectedEndpoint} onchange={query}>
            {#each allEndpoints as endpoint}
                <option value={endpoint}>{endpoint.label}</option>
            {/each}
        </select>

        <label class="input-group-text" for="idInput">ID:</label>
        <input type="number" id="idInput" class="form-control" bind:value={id} min="0" onchange={query} />

        <button type="button" class="btn btn-primary" onclick={query}>Query</button>
    </div>
</div>

<div class="row">
    <div class="col-auto"></div>

    <div class="col">
        {#await promise}
            <p>Loading</p>
        {:then value}
            <div class="overflow-auto" style="max-height: 600px">
                <pre>{JSON.stringify(value, null, 2)}</pre>
            </div>
        {:catch error}
            <div>Something went wrong: {error.message}</div>
        {/await}
    </div>
</div>

<style>
</style>
