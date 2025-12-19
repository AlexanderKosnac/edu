<script>
    const {
        latitude,
        longitude,
        zoom = 8,
    } = $props();

    const links = $derived(() => [
        {
            name: "Google Maps",
            url: `https://www.google.com/maps/place/${latitude},${longitude}`
        },
        {
            name: "OpenStreetMap",
            url: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`
        },
        {
            name: "HERE WeGo",
            url: `https://wego.here.com/location/?map=${latitude},${longitude},${zoom}`
        },
        {
            name: "Bing Maps",
            url: `https://www.bing.com/maps?cp=${latitude}~${longitude}&lvl=${zoom}`
        },
        {
            name: "MapQuest",
            url: `https://www.mapquest.com/latlng/${latitude},${longitude}`
        },
        {
            name: "Yandex Maps",
            url: `https://yandex.com/maps/?ll=${longitude},${latitude}&z=${zoom}`
        },
        {
            name: "Wikimapia",
            url: `https://wikimapia.org/#lat=${latitude}&lon=${longitude}&z=${zoom}`
        },
        {
            name: "GeoHack",
            url: `https://geohack.toolforge.org/geohack.php?params=${latitude}_N_${longitude}_E`
        },
    ]);
</script>

<ul>
    {#each links() as link}
        <li><a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a></li>
    {/each}
</ul>

<style>
</style>
