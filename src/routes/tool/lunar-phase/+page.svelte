<script>
    import { onMount } from "svelte";

    let selectedDateString = getDateLocal();
    $: selectedDate = new Date(selectedDateString);

    let phaseName;

    const newMoonRef = new Date(Date.UTC(2000, 0, 6, 18, 14)); // Reference New Moon date: 2000-01-06 18:14 UTC
    const synodicMonth = 29.530588853; // average lunar month length (days)

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

    function updateLunarPhase() {
        phaseName = getMoonPhaseName(selectedDate);
    }

    function getDateLocal(date = new Date()) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function getMoonPhase(date = new Date()) {
        const diff = (date.getTime() - newMoonRef.getTime()) / 1000 / 86400;
        const lunations = diff / synodicMonth;
        return Math.floor((lunations - Math.floor(lunations)) * 8);
    }

    function daysUntilPhase(targetPhaseIndex, fromDate = new Date()) {
        const currentPhaseIndex = getMoonPhase(fromDate);
        let d = ((targetPhaseIndex - currentPhaseIndex + 7) % 8) + 1;
        return d * (synodicMonth / 8);
    }

    function getMoonPhaseName(date = new Date()) {
        return phases[getMoonPhase(date)];
    }

    function datePlusDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
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
            <input type="date" class="form-control" bind:value={selectedDateString} oninput={updateLunarPhase}/>
        </label>
    </div>
    <div class="col">
        {newMoonRef}<br>
        {synodicMonth} days<br>
        {phaseName}
    </div>
</div>

<div class="row">
    <div class="col">
        {#each phases as phase, i}
            {phase}: {datePlusDays(new Date(), daysUntilPhase(i))} {daysUntilPhase(i)} days<br>
        {/each}
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Lunar_phase" target="_blank">Lunar phase</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Lunar_month" target="_blank">Lunar month</a></li>
            <li><a href="https://science.nasa.gov/moon/moon-phases/" target="_blank">Lunar phase by NASA</a></li>
        </ul>
    </div>
</div>

<style>
</style>