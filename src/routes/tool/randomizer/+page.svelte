<script>
    let min = -5;
    let minInclusive;
    let max = 10;
    let maxInclusive;
    let asInteger;

    let randomNumber;

    function generateRandomNumber() {
        randomNumber = getRandomNumber(min, max, minInclusive, maxInclusive, asInteger);
    }

    function getRandomNumber(min, max, inclusiveMin, inclusiveMax, asInteger) {
        let lower = inclusiveMin ? min : min + Number.EPSILON;
        let upper = inclusiveMax ? max + Number.EPSILON : max;

        let rand = Math.random() * (upper - lower) + lower;

        return asInteger ? Math.floor(rand) : rand;
    }
</script>

<svelte:head>
    <title>Randomizer</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Randomizer</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <div class="d-flex flex-column gap-1 align-items-start">
            <label>
                Minimum:
                <input type="number" class="form-control" bind:value={min}/>
            </label>
            <label>
                <input type="checkbox" class="form-check-input" bind:checked={minInclusive}/>
                Inclusive
            </label>

            <label>
                Maximum:
                <input type="number" class="form-control" bind:value={max}/>
            </label>
            <label>
                <input type="checkbox" class="form-check-input" bind:checked={maxInclusive}/>
                Inclusive
            </label>

            <label>
                <input type="checkbox" class="form-check-input" bind:checked={asInteger}/>
                Integer Result
            </label>
            <button type="button" class="btn btn-primary" on:click={generateRandomNumber}>Generate</button>
        </div>
    </div>
    <div class="col">
        <span class="fs-1 align-self-center">{randomNumber}</span>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
        </ul>
    </div>
</div>

<style>
</style>