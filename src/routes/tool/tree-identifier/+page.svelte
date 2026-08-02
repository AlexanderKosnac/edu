<script>
    import { camelCaseToTitle } from "$lib/stringUtility";

    import trees from "./trees.json";

    const TRAITS = {};

    for (const tree of trees) {
        for (const [trait, value] of Object.entries(tree.traits)) {
            if (!TRAITS[trait]) TRAITS[trait] = new Set();
            TRAITS[trait].add(value);
        }
    }

    for (const trait in TRAITS) {
        TRAITS[trait] = Array.from(TRAITS[trait]);
    }

    let remainingTrees = [...trees];
    let askedTraits = new Map();
    let currentTrait = chooseBestTrait(remainingTrees, askedTraits);

    function chooseBestTrait(trees, asked) {
        let bestTrait = null;
        let bestScore = -1;

        for (const trait of Object.keys(TRAITS)) {
            if (asked.has(trait)) continue;

            const counts = {};
            for (const tree of trees) {
                const value = tree.traits[trait];
                if (value === undefined) continue;
                counts[value] = (counts[value] || 0) + 1;
            }

            const values = Object.values(counts);
            if (values.length < 2) continue;

            const score = Math.min(...values);
            if (score > bestScore) {
                bestScore = score;
                bestTrait = trait;
            }
        }

        return bestTrait;
    }

    function answer(trait, value) {
        askedTraits.set(trait, value);
        askedTraits = new Map(askedTraits);

        remainingTrees = remainingTrees.filter((t) => t.traits[trait] === value);

        currentTrait = chooseBestTrait(remainingTrees, askedTraits);
    }

    function skip() {
        askedTraits.set(currentTrait, null);
        askedTraits = new Map(askedTraits);

        currentTrait = chooseBestTrait(remainingTrees, askedTraits);
    }

    function reset() {
        remainingTrees = [...trees];
        askedTraits = new Map();
        currentTrait = chooseBestTrait(remainingTrees, askedTraits);
    }

    function traitLabel(trait) {
        return {
            evergreen: "Is the tree evergreen?",
        }[trait];
    }

    function getWikipediaSearchLink(searchTerm, language = "en") {
        return `https://${language}.wikipedia.org/w/index.php?search=${encodeURIComponent(searchTerm)}`;
    }
</script>

<div class="row">
    <div class="col">
        <h3>Questions</h3>
        <div class="d-flex flex-column gap-1 pb-1">
            {#each [...askedTraits] as [trait, value]}
                <div>
                    <span>{camelCaseToTitle(trait)}:</span>
                    <strong>
                        {value === true
                            ? "Yes"
                            : value === false
                                ? "No"
                                : camelCaseToTitle(value) ?? "Skipped"}
                    </strong>
                </div>
            {/each}
        </div>

        {#if remainingTrees.length > 1 && currentTrait}
            <div class="d-flex flex-row align-items-center gap-1">
                <strong>{traitLabel(currentTrait) ?? camelCaseToTitle(currentTrait)}:</strong>

                {#each TRAITS[currentTrait] as option}
                    {@const o = option === true ? "Yes" : option === false ? "No" : option}
                    <button type="button" class="btn btn-primary" on:click={() => answer(currentTrait, option)}>{camelCaseToTitle(o)}</button>
                {/each}

                <button type="button" class="btn btn-secondary" on:click={skip}>Skip</button>
            </div>
        {:else}
            <button type="button" class="btn btn-primary" on:click={reset}>Again</button>
        {/if}
    </div>

    <div class="col">
        <h3>Remaining trees ({remainingTrees.length})</h3>
        <ul>
            {#each remainingTrees as tree}
                <li>
                    {tree.name}
                    <a href={getWikipediaSearchLink(tree.scientificName)} target="_blank">Wikipedia</a>
                </li>
            {/each}
        </ul>
    </div>

    <div class="col">
        <h3>Identified tree</h3>
        {#if remainingTrees.length === 1}
            <div>
                <p style="font-size: 2em">
                    <em>{remainingTrees[0].scientificName}</em> - {remainingTrees[0].name}
                </p>
                <a href={getWikipediaSearchLink(remainingTrees[0].scientificName)} target="_blank">Wikipedia</a>
            </div>
        {:else}
            <p>No exact match found.</p>
        {/if}
    </div>
</div>

<style>
</style>
