<script>
    import { get } from "$lib/apiRestUtility";

    let culture = "en-US";

    let year = new Date().getFullYear();

    function getYear(year) {
        return get("https://feiertage-api.de/api/", { jahr: year });
    }

    $: promise = getYear(1999);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

    const isToday = (y, m, d) => {
        const t = new Date();
        return y === t.getFullYear() && m === t.getMonth() && d === t.getDate();
    };

    const weekdayShort = (date) => date.toLocaleDateString(culture, { weekday: "short" });
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
            <input type="number" class="form-control" bind:value={year}/>
        </label>
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
                        <div class="cell d-flex flex-column" class:today={isToday(year, monthIndex, day)}>
                            <span class="day-label">{day} {weekdayShort(date)}</span>
                            <span>&nbsp;</span>
                        </div>
                    {:else}
                        <div class="cell empty"></div>
                    {/if}
                {/each}
            {/each}
        </div>
    </div>
    <div class="col">
        <div class="overflow-auto">
            {#await promise}
                <div>Request pending</div>
            {:then value}
                <pre>{JSON.stringify(value, null, 2)}</pre>
            {:catch error}
                <div>Something went wrong: {error.message}</div>
            {/await}
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
    }

    .label {
        text-align: center;
        font-weight: bold;
    }

    .cell.today {
        border-color: red;
    }

    .day-label {
        font-size: 0.7em;
        font-weight: bold;
    }
</style>
