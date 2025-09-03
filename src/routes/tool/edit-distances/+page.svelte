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

<svelte:head>
    <title>Edit distance</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Edit distance</h1>
    </div>
</div>

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

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Edit_distance" target="_blank">Edit distance</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance" target="_blank">Jaro-Winkler distance</a></li>
        </ul>
    </div>
</div>

<style>
</style>