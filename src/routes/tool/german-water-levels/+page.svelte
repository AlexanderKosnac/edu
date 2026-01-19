<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";

    import { get, getProxiedUrl } from "$lib/apiRestUtility.js";
    import { getStations, getStation } from "$lib/apiPegelOnline";

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

        const width = 640;
        const height = 720;

        const svg = d3.select("#map");
        svg.attr("width", width);
        svg.attr("height", height);

        const node = svg.node();
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }

        const projection = d3
            .geoMercator()
            .center([10.4515, 51.1657])
            .scale(3100)
            .translate([width / 2, height / 2]);
        const path = d3.geoPath(projection);

        svg.append("path").datum(germany).attr("d", path).attr("fill", "transparent").attr("stroke", "currentColor").attr("stroke-width", 2.0);

        for (let p of points) {
            const [x, y] = projection([p.lon, p.lat]);
            svg.append("circle")
                .datum(p.data)
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 5)
                .attr("stroke", "black")
                .attr("stroke-width", "1")
                .attr("fill", "blue")
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
        <svg id="map" width="10" height="10"></svg>
    </div>
    {#if stationPromise === null}
        <div class="col">
            <span>Select a station to view details.</span>
        </div>
    {:else}
        {#await stationPromise}
            <div>Request pending</div>
        {:then value}
            <div class="col overflow-auto" style="max-height: 600px">
                <h2>{value.longname}</h2>
                <ul>
                    <li><button type="button" class="btn btn-link p-0" onclick={() => openJson(value)}>Open json data</button></li>
                    {#if value?.latitude && value?.longitude}
                        <li>Coordinate: {value.latitude}° N, {value.longitude}° E</li>
                    {/if}
                    <li>Water: {value.water.longname}</li>
                </ul>

                Available Timeseries:
                <ul>
                    {#each value?.timeseries as timeseries}
                        <li>
                            {timeseries.longname} ({timeseries.shortname}) in {timeseries.unit}; every {timeseries.equidistance} minutes<br />
                            {#if timeseries.currentMeasurement}
                                {timeseries.currentMeasurement.value}
                                {timeseries.unit}
                                ({timeseries.currentMeasurement.timestamp})
                            {/if}
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
    {/if}
</div>

<div class="row">
    {#await allStationsPromise}
        <div>Request pending</div>
    {:then value}
        <div class="col overflow-auto" style="max-height: 600px">
            <ul>
                {#each value as station}
                    <li>
                        {station.longname}
                        (Coord: {station.latitude ?? "-"}/{station.longitude ?? "-"})
                        <button type="button" class="btn btn-primary" onclick={() => loadStation(station.uuid)}>Load</button>
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
