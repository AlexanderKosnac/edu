<script>
    // Random Number
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

    // Random String
    const randomString = {
        chars: "abc123!?",
        length: 10,
        result: "",
    }

    function generateRandomString() {
        let output = "";
        for (let i = 0; i < randomString.length; i++) {
            const index = Math.floor(Math.random() * randomString.chars.length);
            output += randomString.chars[index];
        }
        randomString.result = output;
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
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="number-tab" data-bs-toggle="tab" data-bs-target="#number" type="button" role="tab" aria-controls="number" aria-selected="true">Number</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="string-tab" data-bs-toggle="tab" data-bs-target="#string" type="button" role="tab" aria-controls="string" aria-selected="false">String</button>
            </li>
        </ul>
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="number" role="tabpanel" aria-labelledby="number-tab">
                <div class="d-flex flex-column gap-1">
                    <div class="d-flex flex-row gap-1 align-items-end">
                        <label>
                            Minimum:
                            <input type="number" class="form-control" bind:value={randomNumber.min}/>
                        </label>

                        <label>
                            Length:
                            <input type="number" class="form-control" bind:value={randomNumber.max}/>
                        </label>
                    </div>

                    <div class="d-flex flex-row gap-3">
                        <label>
                            <input type="checkbox" class="form-check-input" bind:checked={randomNumber.minInclusive}/>
                            Minimum Inclusive
                        </label>
                        <label>
                            <input type="checkbox" class="form-check-input" bind:checked={randomNumber.maxInclusive}/>
                            Maximum Inclusive
                        </label>

                        <label>
                            <input type="checkbox" class="form-check-input" bind:checked={randomNumber.asInteger}/>
                            Integer Result
                        </label>
                    </div>

                    <div class="d-flex flex-row gap-1">
                        <button type="button" class="btn btn-primary align-self-end" onclick={generateRandomNumber}>Generate</button>
                        <input type="text" class="form-control" value={randomNumber.result} readonly/>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="string" role="tabpanel" aria-labelledby="string-tab">
                <div class="d-flex flex-column gap-1">
                    <label>
                        Characters:
                        <input type="text" class="form-control" bind:value={randomString.chars} />
                    </label>

                    <button type="button" class="btn-sm btn-primary" onclick={generateRandomString}>Generate</button>

                    <label class="align-self-start">
                        Length:
                        <input type="number" min="0" class="form-control" bind:value={randomString.length} />
                    </label>

                    <div class="d-flex flex-row gap-1">
                        <button type="button" class="btn btn-primary align-self-end" onclick={generateRandomString} disabled={randomString.chars.length == 0}>Generate</button>
                        <input type="text" class="form-control" value={randomString.result} readonly/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
</style>