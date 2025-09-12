<script>
    import { onMount } from "svelte";

    let selectedDateString = getDateLocal();
    $: selectedDate = new Date(selectedDateString);

    let phaseName;

    function updateLunarPhase() {
        phaseName = getMoonPhaseName(selectedDate);
    }

    function getDateLocal(date = new Date()) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getMoonPhase(date = new Date()) {
        const newMoonRef = new Date(Date.UTC(2000, 0, 6, 18, 14)); // Reference New Moon date: 2000-01-06 18:14 UTC
        const synodicMonth = 29.530588853; // average lunar month length (days)

        const diff = (date.getTime() - newMoonRef.getTime()) / 1000 / 86400;
        const lunations = diff / synodicMonth;

        const phaseIndex = Math.floor((lunations - Math.floor(lunations)) * 8);

        return phaseIndex;
    }

    function getMoonPhaseName(date = new Date()) {
        const phases = [
            "New Moon",
            "Waxing Crescent",
            "First Quarter",
            "Waxing Gibbous",
            "Full Moon",
            "Waning Gibbous",
            "Last Quarter",
            "Waning Crescent"
        ];

        return phases[getMoonPhase(date)];
    }

    onMount(() => {
        updateLunarPhase();
    });
</script>

<svelte:head>
    <title>Lunar Phase</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Lunar Phase</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <label>
            Date:
            <input type="date" class="form-control" bind:value={selectedDateString} on:input={updateLunarPhase}/>
        </label>
    </div>
    <div class="col">
        {phaseName}
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Lunar_phase" target="_blank">Lunar phase</a></li>
        </ul>
    </div>
</div>

<style>
</style>