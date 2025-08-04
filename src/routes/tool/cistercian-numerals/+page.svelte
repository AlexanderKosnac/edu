<script>
    import CistercianNumber from "$lib/CistercianNumber/CistercianNumber.svelte";

    let number = 1234;

    const overviewValues = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [10, 20, 30, 40, 50, 60, 70, 80, 90],
        [100, 200, 300, 400, 500, 600, 700, 800, 900],
        [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000],
        [0, 9999, 22]
    ];
</script>

<svelte:head>
    <title>Cistercian numerals</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Cistercian numerals</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <CistercianNumber bind:number={number} size="256" borderWidth={4}/>
    </div>
    <div class="col-auto">
        <label>
            Number:
            <input type="number" class="form-control" bind:value={number} min="0" max="9999"/>
        </label>
    </div>
</div>

<div class="row mt-1">
    <div class="col">
        <h2>Overview</h2>
        <div>
            {#each overviewValues as rowEntries}
                <div class="d-flex flex-row gap-3">
                    {#each rowEntries as entry}
                        <div class="d-felx gap-1">
                            <div class="text-center">{entry}</div>
                            <div><CistercianNumber number={entry} size="64" strokeWidth="2" borderWidth="2"/></div>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Cistercian_numerals" target="_blank">Cistercian numerals</a></li>
        </ul>
    </div>
</div>

<style>
</style>