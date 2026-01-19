<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";

    import { get, getProxiedUrl } from "$lib/apiRestUtility.js";
    import { getStations, getStation } from "$lib/apiPegelOnline";

    const svgWidth = 640;
    const svgHeight = 720;

    let allStationsPromise = null;
    let stationPromise = null;

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

    onMount(() => {
        loadGeoJson();
        loadAllStations();
        markStations();
    });
</script>

<div class="row">
    <div class="col-auto">
        <svg id="map" width={svgWidth} height={svgHeight}></svg>
    </div>
    {#if stationPromise === null}
        <div class="col">
            <span>Select a station to view details.</span>
        </div>
    {:else}
        {#await stationPromise}
            <div>Request pending</div>
        {:then value}
            <div class="col">
                <h2>{value.longname}</h2>
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

                            <pre>{JSON.stringify(timeseries, null, 2)}</pre>
                        </div>
                    {/each}
                </div>
            </div>
            <!--
            <div class="col overflow-auto" style="max-height: 600px">
                <pre>{JSON.stringify(value, null, 2)}</pre>
            </div>
            -->
        {:catch error}
            <div>Something went wrong: {error.message}</div>
        {/await}
    {/if}
</div>

<div class="row">
    {#await allStationsPromise}
        <div>Request pending</div>
    {:then value}
        <h2>All Stations</h2>
        <div class="col overflow-auto" style="max-height: 600px">
            <ul>
                {#each value as station}
                    <li>
                        <span class="align-self-center">{station.longname}</span>
                        <button type="button" class="btn btn-link p-0 align-baseline" onclick={() => loadStation(station.uuid)}>Load</button>
                    </li>
                {/each}
            </ul>
        </div>
        <div class="col overflow-auto" style="max-height: 600px">
            <pre>{JSON.stringify(value, null, 2)}</pre>
        </div>
    {:catch error}
        <div>Something went wrong: {error.message}</div>
    {/await}
</div>

<style>
</style>
