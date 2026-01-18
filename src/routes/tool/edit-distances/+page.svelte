<script>
    import { jaroDistance, levenshteinDistance, hammingDistance } from "$lib/editDistance";

    let string1 = "Something";
    let string2 = "Somehting";

    let currentDistanceMeasure = "Levenshtein distance";

    $: distance = distanceMeasures[currentDistanceMeasure](string1, string2);

    const distanceMeasures = {
        "Levenshtein distance": (s1, s2) => levenshteinDistance(s1, s2),
        "Jaro similarity": (s1, s2) => jaroDistance(s1, s2),
        "Hamming distance": (s1, s2) => hammingDistance(s1, s2),
    };
</script>

<div class="row">
    <div class="col">
        <div class="d-flex flex-column">
                <label>
                    Measure:
                    <select class="form-select" bind:value={currentDistanceMeasure}>
                        {#each Object.entries(distanceMeasures) as [name, _]}
                            <option value={name}>{name}</option>
                        {/each}
                    </select>
                </label>
            <label>
                Text 1:
                <input type="text" class="form-control font-monospace" bind:value={string1} />
            </label>

            <label>
                Text 2:
                <input type="text" class="form-control font-monospace" bind:value={string2} />
            </label>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        Distance: {distance}
    </div>
</div>

<style>
</style>