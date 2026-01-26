<script>
    import "bootstrap/dist/css/bootstrap.min.css";
    import jsBootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js?url";
    import "bootstrap-icons/font/bootstrap-icons.css";

    import Fuse from "fuse.js";

    import { base } from "$app/paths";
    import ThemeToggle from "$lib/ThemeToggle/ThemeToggle.svelte";
    import GitHubReference from "$lib/GitHubReference/GitHubReference.svelte";

    import aggregateOverview from "./aggregate-overview-data.json";

    const fuse = new Fuse(aggregateOverview, {
        keys: ["name", "description"],
        threshold: 0.5,
        distance: 50,
        tokenize: true,
        matchAllTokens: true,
        includeScore: true,
        includeMatches: true,
    });

    let search = "";
    $: results = fuse.search(search);

    function clearSearch() {
        search = "";
    }

    function highlightText(value, indices) {
        if (indices === undefined) return [{ text: value, highlight: false }];

        let lastIndex = 0;
        const parts = [];

        for (const [start, end] of indices) {
            if (lastIndex < start) {
                parts.push({ text: value.slice(lastIndex, start), highlight: false });
            }
            parts.push({ text: value.slice(start, end + 1), highlight: true });
            lastIndex = end + 1;
        }

        if (lastIndex < value.length) {
            parts.push({ text: value.slice(lastIndex), highlight: false });
        }

        return parts;
    }

    function spanHighlightedHtml(value, indices) {
        return highlightText(value, indices)
            .map((part) => (part.highlight ? `<span class="highlight">${part.text}</span>` : part.text))
            .join("");
    }
</script>

<svelte:head>
    <script src={jsBootstrap}></script>
    <title>edu</title>
</svelte:head>

<nav class="navbar navbar-expand-lg bg-body-tertiary flex-nowrap">
    <div class="container-fluid">
        <a class="navbar-brand" href="{base}/" draggable="false" onclick={clearSearch}>
            <img src="{base}/favicon.svg" alt="Logo" width="30" height="30" class="d-inline-block align-text-top" draggable="false" />
        </a>
        <input class="form-control search-bar mr-1rem" type="search" placeholder="Search..." aria-label="Search" bind:value={search} />
        <div class="nav-item d-flex flex-row gap-3 justify-content-center">
            <GitHubReference root="https://github.com/AlexanderKosnac/edu" routeRoot="tree/master/src/routes" width="24" height="24" />
            <ThemeToggle width="24" height="24" />
        </div>
    </div>
</nav>

<div class="container-fluid">
    {#if search}
        <div class="row justify-content-center mt-2">
            <div class="col-lg-10">
                <div class="d-flex flex-column gap-2">
                    {#each results.sort((a, b) => a.refIndex - b.refIndex) as result}
                        {@const entry = result.item}
                        {#if entry.usable ?? true}
                            <div class="card tool-card">
                                <div class="card-body">
                                    <h5 class="card-title">
                                        <a class="icon-link icon-link-hover" href="{base}/{entry.url}" onclick={clearSearch}>
                                            {entry.name}
                                            <i class="bi bi-arrow-right-short"></i>
                                        </a>
                                    </h5>
                                    <p class="card-text">
                                        {@html spanHighlightedHtml(entry.description, result.matches.find((e) => e.key === "description")?.indices)}
                                    </p>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    {:else}
        <slot />
    {/if}
</div>

<style>
    .mr-1rem {
        margin-right: 1rem;
    }
    .search-bar {
        max-width: 800px;
    }
    :global(span.highlight) {
        font-weight: 900;
    }
</style>
