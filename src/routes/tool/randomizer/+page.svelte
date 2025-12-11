<script>
    const randomNumber = {
        min: -5,
        minInclusive: true,
        max: 10,
        maxInclusive: false,
        asInteger: false,
        result: 0,
    }

    function generateRandomNumber() {
        randomNumber.result = getRandomNumber(randomNumber.min, randomNumber.max, randomNumber.minInclusive, randomNumber.maxInclusive, randomNumber.asInteger);
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
    <div class="col">
        <h2>Random Number</h2>
        <div class="d-flex flex-row gap-1 align-items-end">
            <label>
                Minimum:
                <input type="number" class="form-control" bind:value={randomNumber.min}/>
            </label>

            <label>
                Length:
                <input type="number" class="form-control" bind:value={randomNumber.max}/>
            </label>

            <div class="d-flex flex-column">
                <label>
                    <input type="checkbox" class="form-check-input" bind:checked={randomNumber.minInclusive}/>
                    Min. Inclusive
                </label>
                <label>
                    <input type="checkbox" class="form-check-input" bind:checked={randomNumber.maxInclusive}/>
                    Max. Inclusive
                </label>

                <label>
                    <input type="checkbox" class="form-check-input" bind:checked={randomNumber.asInteger}/>
                    Integer Result
                </label>
            </div>

            <button type="button" class="btn btn-primary align-self-center" onclick={generateRandomNumber}>Generate</button>

            <span class="align-self-center">{randomNumber.result}</span>
        </div>
    </div>
</div>

<style>
</style>