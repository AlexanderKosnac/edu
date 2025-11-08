<script>
    let selectedDatetimeString = getDateLocal();

    const newMoonRef = new Date(Date.UTC(2000, 0, 6, 18, 14, 0)); // Meeus Lunation Number 0
    const synodicMonth = 29.53058867; // average lunar month length (days)

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
        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hour}:${minute}`;
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

    let currentTimeUnit = "day";

    function changeTime(value) {
        const d = new Date(selectedDatetimeString);
        const methods = {
            day: () => d.setDate(d.getDate() + value),
            hour: () => d.setHours(d.getHours() + value),
            minute: () => d.setMinutes(d.getMinutes() + value),
        };
        methods[currentTimeUnit]();
        selectedDatetimeString = getDateLocal(d);
    }

    $: selectedDatetime = new Date(selectedDatetimeString);
    $: currentPhaseFraction = getMoonPhaseFraction(selectedDatetime);
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

{#snippet moon(size, radius, phaseFraction)}
    {@const offset = phaseFractionToIlluminationFraction(phaseFraction) * radius}
    <svg width={size} height={size} viewBox="-{Math.floor(size/2)} -{Math.floor(size/2)} {size} {size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="0" r="{radius}" fill="#444" />
        {#if phaseFraction < 0.5}
            <path d="M 0 {radius}  A {radius},{radius} 0 1 0 0,{-radius}  A {offset},{radius} 0 0 {offset > 0 ? 1 : 0} 0,{radius}  Z" fill="#f4f4f4" />
        {:else}
            <path d="M 0 {radius}  A {radius},{radius} 0 1 1 0,{-radius}  A {offset},{radius} 0 0 {offset > 0 ? 0 : 1} 0,{radius}  Z" fill="#f4f4f4" />
        {/if}
    </svg>
{/snippet}

{#snippet moonEarthRelation(size, radius, phaseFraction)}
    {@const phaseFractionRotation = phaseFraction * 360}
    {@const moonRadius = radius * 0.2}
    {@const earthRadius = radius * 0.4}
    <svg width={size} height={size} viewBox="-{Math.floor(size/2)} -{Math.floor(size/2)} {size} {size}" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0,-{earthRadius} A 1,1 0 0 0 0,{earthRadius} Z" fill="#0000aa" />
        <path d="M 0,-{earthRadius} A 1,1 0 0 1 0,{earthRadius} Z" fill="#3333ff" />

        <circle cx="0" cy="0" r={radius} fill="none" stroke="currentColor" stroke-dasharray="4" />

        <g transform="rotate({-phaseFractionRotation}) translate({radius}, 0) rotate({phaseFractionRotation})">
            <path d="M 0,-{moonRadius} A 1,1 0 0 0 0,{moonRadius} Z" fill="#444" />
            <path d="M 0,-{moonRadius} A 1,1 0 0 1 0,{moonRadius} Z" fill="#f4f4f4" />
            <text fill="currentColor" text-anchor="middle" transform="translate(0, -{moonRadius * 1.3})">
                {phases[getMoonPhaseIndexFromFraction(phaseFraction)]}
            </text>
        </g>

        <circle cx="0" cy="0" r="1" fill="none" stroke="currentColor" />
        {#each [15, 30, 45, 60, 75, 90] as lat}
            {@const r = earthRadius * Math.cos(lat * Math.PI / 180)}
            <circle cx="0" cy="0" r={r} fill="none" stroke="currentColor" />
        {/each}
        {#each Array.from({ length: 12 }, (_, i) => i * 30) as lon}
            {@const angle = lon * Math.PI / 180}
            {@const x = Math.sin(angle) * earthRadius}
            {@const y = -Math.cos(angle) * earthRadius}
            <line x1="0" y1="0" x2={x} y2={y} stroke="currentColor" />
        {/each}
    </svg>
{/snippet}

<div class="row">
    <div class="col-auto d-flex flex-column gap-1">
        <div>
            New moon reference date: {newMoonRef}<br>
            Average lunar month length (days) {synodicMonth} days
        </div>
        <div class="input-group">
            <span class="input-group-text">Date:</span>
            <input type="datetime-local" class="form-control" bind:value={selectedDatetimeString} style="max-width: 20em" />
            <button type="button" class="btn btn-secondary" onclick={() => changeTime(-1)}>-1</button>
            <button type="button" class="btn btn-secondary" onclick={() => changeTime(+1)}>+1</button>
            <select class="form-select" id="stepSelect" bind:value={currentTimeUnit} style="max-width: 8em">
                <option value="day">Day</option>
                <option value="hour">Hour</option>
                <option value="minute">Minute</option>
            </select>
        </div>

        <div class="row">
            <div class="col">
                <div class="d-flex flex-column align-items-center">
                    {@render moon(400, 160, currentPhaseFraction)}
                    {currentPhaseName}
                </div>
            </div>
            <div class="col">
                <div class="d-flex flex-column align-items-center">
                    {@render moonEarthRelation(400, 160, currentPhaseFraction)}
                </div>
            </div>
        </div>
    </div>

    <div class="col">
        <table class="table table-bordered w-auto mt-1">
            <thead>
                <tr>
                    <th>Phase</th>
                    <th>Symbol</th>
                    <th>Next Occurrence</th>
                </tr>
            </thead>
            <tbody>
                {#each phases as phase, i}
                <tr>
                    <td>{phase}</td>
                    <td>{@render moon(64, 24, i/8)}</td>
                    <td>
                        {datePlusDays(new Date(), daysUntilPhase(i))}<br>
                        {daysUntilPhase(i).toFixed(3)} days
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
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