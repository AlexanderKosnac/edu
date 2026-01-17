<script>
    import MapLinks from "$lib/MapLinks/MapLinks.svelte";
    import Map from "$lib/Map/Map.svelte";

    // Utility
    function getRandomNumber(min, max, inclusiveMin, inclusiveMax, asInteger) {
        let lower = inclusiveMin ? min : min + Number.EPSILON;
        let upper = inclusiveMax ? max + Number.EPSILON : max;

        let rand = Math.random() * (upper - lower) + lower;

        return asInteger ? Math.floor(rand) : rand;
    }

    // Random Number
    const randomNumber = {
        min: -5,
        minInclusive: true,
        max: 10,
        maxInclusive: false,
        asInteger: false,
        result: 0,
    };

    function generateRandomNumber() {
        randomNumber.result = getRandomNumber(randomNumber.min, randomNumber.max, randomNumber.minInclusive, randomNumber.maxInclusive, randomNumber.asInteger);
    }

    // Random String
    const randomString = {
        chars: "abc123!?",
        length: 10,
        result: "",
    };

    function generateRandomString() {
        let output = "";
        for (let i = 0; i < randomString.length; i++) {
            const index = Math.floor(Math.random() * randomString.chars.length);
            output += randomString.chars[index];
        }
        randomString.result = output;
    }

    // Random Coordinate
    const randomCoord = {
        result: {
            latitude: 40.7214096863636,
            longitude: -74.06092110004458,
        },
    };

    function generateRandomCoordinate() {
        const u = Math.random();
        const v = Math.random();

        const latitude = Math.asin(2 * u - 1) * (180 / Math.PI);
        const longitude = 360 * v - 180;

        randomCoord.result.latitude = latitude;
        randomCoord.result.longitude = longitude;
    }
</script>

<div class="row">
    <div class="col">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="number-tab" data-bs-toggle="tab" data-bs-target="#number" type="button" role="tab" aria-controls="number" aria-selected="true">Number</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="string-tab" data-bs-toggle="tab" data-bs-target="#string" type="button" role="tab" aria-controls="string" aria-selected="false">String</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="coordinate-tab" data-bs-toggle="tab" data-bs-target="#coordinate" type="button" role="tab" aria-controls="coordinate" aria-selected="false">Coordinate</button>
            </li>
        </ul>
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="number" role="tabpanel" aria-labelledby="number-tab">
                <div class="d-flex flex-column gap-1">
                    <div class="d-flex flex-row gap-1 align-items-end">
                        <label>
                            Minimum:
                            <input type="number" class="form-control" bind:value={randomNumber.min} />
                        </label>

                        <label>
                            Maximum:
                            <input type="number" class="form-control" bind:value={randomNumber.max} />
                        </label>
                    </div>

                    <div class="d-flex flex-row gap-3">
                        <label>
                            <input type="checkbox" class="form-check-input" bind:checked={randomNumber.minInclusive} />
                            Minimum Inclusive
                        </label>
                        <label>
                            <input type="checkbox" class="form-check-input" bind:checked={randomNumber.maxInclusive} />
                            Maximum Inclusive
                        </label>

                        <label>
                            <input type="checkbox" class="form-check-input" bind:checked={randomNumber.asInteger} />
                            Integer Result
                        </label>
                    </div>

                    <div class="d-flex flex-row gap-1">
                        <button type="button" class="btn btn-primary align-self-end" onclick={generateRandomNumber}>Generate</button>
                        <input type="text" class="form-control" value={randomNumber.result} readonly />
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="string" role="tabpanel" aria-labelledby="string-tab">
                <div class="d-flex flex-column gap-1">
                    <label>
                        Characters:
                        <input type="text" class="form-control" bind:value={randomString.chars} />
                    </label>

                    <label class="align-self-start">
                        Length:
                        <input type="number" min="0" class="form-control" bind:value={randomString.length} />
                    </label>

                    <div class="d-flex flex-row gap-1">
                        <button type="button" class="btn btn-primary align-self-end" onclick={generateRandomString} disabled={randomString.chars.length == 0}>Generate</button>
                        <input type="text" class="form-control" value={randomString.result} readonly />
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="coordinate" role="tabpanel" aria-labelledby="coordinate-tab">
                <div class="d-flex flex-column gap-1">
                    <label>
                        Latitude:
                        <input type="number" class="form-control" bind:value={randomCoord.result.latitude} min="-90" max="90" step="0.1"/>
                    </label>

                    <label>
                        Longitude:
                        <input type="number" class="form-control" bind:value={randomCoord.result.longitude} min="0" max="180" step="0.1"/>
                    </label>

                    <button type="button" class="btn btn-primary" onclick={generateRandomCoordinate}>Generate</button>
                </div>

                <div class="d-flex flex-row gap-1 mt-1">
                    <MapLinks latitude={randomCoord.result.latitude} longitude={randomCoord.result.longitude} />
                    <Map lat={randomCoord.result.latitude} lon={randomCoord.result.longitude} zoom={12} />
                </div>
            </div>
        </div>
    </div>
</div>

<style>
</style>
