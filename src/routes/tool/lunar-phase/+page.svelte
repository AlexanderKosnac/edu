<script>
    const radius = 100;

    let selectedDateString = getDateLocal();

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

    function getDateLocal(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    /*
     * Phase as a fraction from 0 to 1.
     * - 0   = new moon
     * - 0.5 = full moon
     * - 1   = new moon
     */
    function getMoonPhaseFraction(date = new Date()) {
        const diff = (date.getTime() - newMoonRef.getTime()) / 86_400_000;
        const lunations = diff / synodicMonth;
        return lunations - Math.floor(lunations); // between 0 and 1
    }

    function getMoonPhaseIndexFromFraction(f) {
        return Math.round(f * 8) % 8;
    }

    function getMoonPhaseIndex(date = new Date()) {
        const f = getMoonPhaseFraction(date);
        return getMoonPhaseIndexFromFraction(f);
    }

    // Maps 0 to 1 to -1 to 1
    function phaseFractionToIlluminationFraction(phase) {
        return Math.cos(phase * 2 * Math.PI);
    }

    function daysUntilPhase(targetPhaseIndex, fromDate = new Date()) {
        const currentPhaseIndex = getMoonPhaseIndex(fromDate);
        let d = ((targetPhaseIndex - currentPhaseIndex + 7) % 8) + 1;
        return d * (synodicMonth / 8);
    }

    function datePlusDays(date, days) {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function nextDay() {
        const d = new Date(selectedDateString);
        d.setDate(d.getDate() + 1);
        selectedDateString = getDateLocal(d);
    }

    function previousDay() {
        const d = new Date(selectedDateString);
        d.setDate(d.getDate() - 1);
        selectedDateString = getDateLocal(d);
    }

    $: selectedDate = new Date(selectedDateString);
    $: currentPhaseFraction = getMoonPhaseFraction(selectedDate);
    $: currentPhaseName = phases[getMoonPhaseIndexFromFraction(currentPhaseFraction)];
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
        <div class="input-group">
            <span class="input-group-text">Date:</span>
            <input type="date" class="form-control" bind:value={selectedDateString} />
            <button type="button" class="btn btn-secondary" onclick={previousDay}>-1</button>
            <button type="button" class="btn btn-secondary" onclick={nextDay}>+1</button>
        </div>
    </div>
    <div class="col">
        {newMoonRef}<br>
        {synodicMonth} days<br>
        {currentPhaseName}
    </div>
</div>

<div class="row">
    <div class="col">
        <div>
            <input type="range" class="form-range" min="0" max="1" step="0.01" bind:value={phaseFraction}>
            <span>pf: {phaseFraction};</span>
        </div>
    </div>
    <div class="col">
        <svg width="256" height="256" viewBox="-128 -128 256 256" xmlns="http://www.w3.org/2000/svg">
            <circle cx="0" cy="0" r="{radius}" fill="#444" />
            {#if phaseFraction < 0.5}
                <path d="M 0 {radius}  A {radius},{radius} 0 1 0 0,{-radius}  A {offset},{radius} 0 0 {offset > 0 ? 1 : 0} 0,{radius}  Z" fill="#f4f4f4" />
            {:else}
                <path d="M 0 {radius}  A {radius},{radius} 0 1 1 0,{-radius}  A {offset},{radius} 0 0 {offset > 0 ? 0 : 1} 0,{radius}  Z" fill="#f4f4f4" />
            {/if}
        </svg>
        <svg width="256" height="256" viewBox="-128 -128 256 256" xmlns="http://www.w3.org/2000/svg">
            <circle cx="0" cy="0" r="40" fill="blue" />
            <circle cx="0" cy="0" r={radius} fill="none" stroke="currentColor" stroke-dasharray="4" />
            <g transform="rotate({-phaseFractionRotation}) translate({radius}, 0) rotate({phaseFractionRotation})">
                <path d="M 0,-20 A 1,1 0 0 0 0,20 Z" fill="#444" />
                <path d="M 0,-20 A 1,1 0 0 1 0,20 Z" fill="#f4f4f4" />
                <text fill="currentColor" text-anchor="middle" transform="translate(0, -25)">{currentPhaseName}</text>
            </g>
        </svg>
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
    svg {
        border: 1px solid var(--bs-body-color);
    }
</style>