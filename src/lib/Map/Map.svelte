<script>
    let { lat, lon, zoom } = $props();

    let mapDiv;
    let map;

    $effect(async () => {
        if (!mapDiv || map)
            return;

        const L = await import("leaflet");
        await import("leaflet/dist/leaflet.css");

        map = L.map(mapDiv);
        map.setView([lat, lon], zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        return () => {
            map?.remove();
            map = null;
        };
    });

    $effect(() => {
        lat, lon, zoom; // Important to trigger reactivity properly.
        if (!map || lat == null || lon == null)
            return;
        map.setView([lat, lon], map.getZoom(), { animate: true });
    });
</script>

<div bind:this={mapDiv} class="map"></div>

<style>
    .map {
        height: 600px;
        width: 100%;
    }
</style>

