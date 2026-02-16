<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";

    import { get, getProxiedUrl } from "$lib/apiRestUtility.js";
    import { getStations, getStation, getMeasurementsPngUrl } from "$lib/apiPegelOnline";
    import Scale from "./Scale.svelte";

    const svgWidth = 640;
    const svgHeight = 720;

    let selectionMethod = "Map";

    let allStationsPromise = Promise.resolve(null);
    let stationPromise = Promise.resolve(null);

    function loadAllStations() {
        allStationsPromise = getStations();
    }

    function loadStation(uuid) {
        stationPromise = getStation(uuid);
    }

    function openJson(data) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
    }

    async function markStations() {
        const p = await allStationsPromise;

        const points = p
            .filter((s) => s.latitude != null && s.longitude != null)
            .map((station) => ({
                lon: station.longitude,
                lat: station.latitude,
                data: {
                    uuid: station.uuid,
                },
            }));
        loadGeoJson(points);
    }

    async function loadGeoJson(points = []) {
        const gjSource = await get("https://www.geoboundaries.org/api/current/gbOpen/DEU/ADM0/");
        const germany = await d3.json(getProxiedUrl(gjSource.simplifiedGeometryGeoJSON));

        const svg = d3.select("#map");
        svg.attr("width", svgWidth);
        svg.attr("height", svgHeight);

        const node = svg.node();
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }

        const projection = d3
            .geoMercator()
            .center([10.4515, 51.1657])
            .scale(3100)
            .translate([svgWidth / 2, svgHeight / 2]);
        const path = d3.geoPath(projection);

        svg.append("path").datum(germany).attr("d", path).attr("fill", "transparent").attr("stroke", "currentColor").attr("stroke-width", 2);

        for (let p of points) {
            const [x, y] = projection([p.lon, p.lat]);
            svg.append("circle")
                .datum(p.data)
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 4)
                .attr("stroke", "currentColor")
                .attr("stroke-width", 1)
                .attr("fill", "#8080FF")
                .on("click", function (event, d) {
                    loadStation(d.uuid);
                });
        }
    }

    function niceStep(min, max, nPoints) {
        const range = max - min;
        if (range === 0 || nPoints <= 1) return 1;

        const fractionalStep = range / (nPoints - 1);

        const magnitude = 10 ** Math.floor(Math.log10(fractionalStep));
        const normalized = fractionalStep / magnitude;

        let niceNormalized;
        if (normalized <= 1) niceNormalized = 1;
        else if (normalized <= 2) niceNormalized = 2;
        else if (normalized <= 5) niceNormalized = 5;
        else niceNormalized = 10;

        return niceNormalized * magnitude;
    }

    const roundDownToN = (value, n) => Math.floor(value / n) * n;
    const roundUpToN = (value, n) => Math.ceil(value / n) * n;

    onMount(() => {
        loadAllStations();
        markStations();
    });
</script>

<div class="row">
    <div class="col">
        <div class="alert alert-info" role="alert">This page relies on API calls through a CORS proxy. If the proxy is overloaded, it may not work properly. Please come back later.</div>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <h2>Stations</h2>
        {#await allStationsPromise}
            <div>Request pending</div>
        {:then value}
            {#if value}
                <div class="d-flex flex-row gap-5 mb-1">
                    <div>
                        {value?.length} stations loaded
                    </div>
                    <div class="flex-grow-1"></div>
                    <div class="d-flex flex-row gap-2">
                        Display:
                        <label>
                            <input type="radio" class="form-check-input" value="List" bind:group={selectionMethod} />
                            List
                        </label>
                        <label>
                            <input type="radio" class="form-check-input" value="Map" bind:group={selectionMethod} />
                            Map
                        </label>
                    </div>
                    <div class="flex-grow-1"></div>
                    <button type="button" class="btn btn-link p-0 align-baseline" onclick={() => openJson(value)}>Open json data</button>
                </div>

                <div hidden={selectionMethod === "List"}>
                    <svg id="map" width={svgWidth} height={svgHeight}></svg>
                </div>
                <div hidden={selectionMethod === "Map"}>
                    <div class="overflow-auto" style="max-height: 600px">
                        <ul>
                            {#each value?.sort((a, b) => a.longname.localeCompare(b.longname, undefined, { sensitivity: "base" })) as station}
                                <li>
                                    <button type="button" class="btn btn-link p-0 align-baseline" onclick={() => loadStation(station.uuid)}>
                                        {station.longname}
                                    </button>
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>
            {:else}
                <div>No data.</div>
            {/if}
        {:catch error}
            <div>Something went wrong: {error.message}</div>
        {/await}
    </div>
    <div class="col">
        {#if stationPromise === null}
            <h2>Station Details</h2>
            <p>Select a station from the list or click a mark on the map to view detailed information on it.</p>
        {:else}
            {#await stationPromise}
                <h2>Station Details</h2>
                <div>Request pending</div>
            {:then value}
                {#if value}
                    <h2>{value?.longname}</h2>
                    <ul>
                        <li><button type="button" class="btn btn-link p-0 align-baseline" onclick={() => openJson(value)}>Open json data</button></li>
                        {#if value?.latitude && value?.longitude}
                            <li>Coordinate: {value.latitude}° N, {value.longitude}° E</li>
                        {/if}
                        <li>Water: {value.water.longname}</li>
                    </ul>

                    <h3>Available Timeseries</h3>
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        {#each value?.timeseries as timeseries, i}
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" class:active={i == 0} id="ts-{timeseries.shortname}-tab" data-bs-toggle="tab" data-bs-target="#ts-{timeseries.shortname}" type="button" role="tab" aria-controls={timeseries.shortname} aria-selected="true">{timeseries.shortname}</button>
                            </li>
                        {/each}
                    </ul>
                    <div class="tab-content" id="myTabContent">
                        {#each value?.timeseries as timeseries, i}
                            {@const allMarks = [
                                {
                                    label: "Current Measurement",
                                    value: timeseries.currentMeasurement.value,
                                },
                                ...timeseries.characteristicValues.map((ts) => ({
                                    label: ts.longname,
                                    value: ts.value,
                                })),
                            ]}
                            {@const allValues = allMarks.map((ts) => ts.value)}
                            {@const valMin = Math.min(...allValues)}
                            {@const valMax = Math.max(...allValues)}
                            {@const valStep = niceStep(valMin, valMax, 10)}

                            <div class="tab-pane" class:show={i == 0} class:active={i == 0} id="ts-{timeseries.shortname}" role="tabpanel" aria-labelledby="ts-{timeseries.shortname}-tab">
                                <div class="d-flex flex-column">
                                    <ul>
                                        <li>{timeseries.longname} in {timeseries.unit}; measured every {timeseries.equidistance} minutes</li>
                                        {#if timeseries.currentMeasurement}
                                            <li>
                                                Last measurement:
                                                {timeseries.currentMeasurement.value}
                                                {timeseries.unit}
                                                ({timeseries.currentMeasurement.timestamp})
                                            </li>
                                        {/if}
                                    </ul>
                                </div>

                                <div class="d-flex flex-row">
                                    <div>
                                        {#if allValues.length > 1}
                                            <Scale min={roundDownToN(valMin, valStep)} max={roundUpToN(valMax, valStep)} step={valStep} marks={allMarks} width={300} height={400} secondaryColor="#8080FF" fontSize="12" orientation="vertical" />
                                        {/if}
                                        <img src={getMeasurementsPngUrl(value.uuid, timeseries.shortname, {})} alt="Measurement URL" />
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div>No data.</div>
                {/if}
            {:catch error}
                <p>Something went wrong: {error.message}</p>
            {/await}
        {/if}
    </div>
</div>

<style>
</style>
