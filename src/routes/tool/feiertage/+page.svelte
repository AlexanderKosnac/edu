<script>
    import { onMount } from "svelte";

    import { get } from "$lib/apiRestUtility";

    const API_BASE = "https://feiertage-api.de/api/";

    let culture = "de-DE";

    let year = new Date().getFullYear();

    let yearData = null;
    let selectedLand = "NATIONAL";

    $: holidaysByDate = (() => {
        const result = {};

        const landData = yearData?.[selectedLand];
        if (!landData) return result;

        for (const [name, { datum }] of Object.entries(landData)) {
            result[datum] = name;
        }
        return result;
    })();

    const months = getMonthNames(culture);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

    const isToday = (y, m, d) => {
        const t = new Date();
        return y === t.getFullYear() && m === t.getMonth() && d === t.getDate();
    };

    const weekdayShort = (date) => date.toLocaleDateString(culture, { weekday: "short" });

    const isoDate = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    let loading = false;
    let error = null;

    async function fetchYearData(y) {
        yearData = null;
        error = null;
        loading = true;
        try {
            yearData = await get(API_BASE, { jahr: y });
        } catch (e) {
            error = e;
        } finally {
            loading = false;
        }
    }

    function getMonthNames(locale, format = "long") {
        return Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat(locale, { month: format }).format(new Date(2000, i, 1)));
    }

    let mounted = false;
    onMount(() => {
        mounted = true;
        fetchYearData(year);
    });

    $: if (mounted) fetchYearData(year);
</script>

<svelte:head>
    <title>Feiertage</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Feiertage</h1>
    </div>
</div>

<div class="row mb-1">
    <div class="col">
        <label>
            Year:
            <input type="number" class="form-control" bind:value={year} />
        </label>
        <div class="d-flex flex-row gap-3">
            {#each Object.keys(yearData ?? {}) as land}
                <label class="text-nowrap">
                    <input type="radio" class="form-check-input" value={land} bind:group={selectedLand} />
                    {land}
                </label>
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="calendar">
            {#each months as month}
                <div class="cell label">{month}</div>
            {/each}

            {#each Array(31) as _, dayIndex}
                {@const day = dayIndex + 1}

                {#each months as _, monthIndex}
                    {#if day <= daysInMonth(year, monthIndex)}
                        {@const date = new Date(year, monthIndex, day)}
                        {@const dateKey = isoDate(year, monthIndex, day)}
                        <div class="cell d-flex flex-column" class:today={isToday(year, monthIndex, day)}>
                            <span class="day-label">{day} {weekdayShort(date)}</span>
                            <span class="text-nowrap">{@html holidaysByDate[dateKey] ?? "&nbsp;"}</span>
                        </div>
                    {:else}
                        <div class="cell empty"></div>
                    {/if}
                {/each}
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://feiertage-api.de/" target="_blank">feiertage-api.de</a></li>
            <li><a href="https://de.wikipedia.org/wiki/Feiertag_(Deutschland)" target="_blank">Feiertage on Wikipedia</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Public_holidays_in_Germany" target="_blank">Public holidays in Germany on Wikipedia</a></li>
        </ul>
    </div>
</div>

<style>
    .calendar {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        border-width: 0px 1px 1px 0px;
        border-style: solid;
        border-color: var(--bs-body-color);
    }

    .cell {
        border-width: 1px 0px 0px 1px;
        border-style: solid;
        border-color: var(--bs-body-color);
        padding: 2px;
        font-size: 0.8em;
    }

    .label {
        text-align: center;
        font-weight: bold;
    }

    .cell.today {
        border-color: red;
    }

    .day-label {
        font-weight: bold;
    }
</style>
