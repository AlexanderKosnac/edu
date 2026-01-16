<script>
    export let data;

    const domainLabels = {
        "npmjs.com": (url) => {
            const parts = new URL(url).pathname.split("/").filter(Boolean);
            if (parts[0] === "package" && parts[1]) {
                return `${parts[1]} (npm package)`;
            }
            return "Unknown npm package";
        },
        "wikipedia.org": (url) => {
            const parts = new URL(url).pathname.split("/").filter(Boolean);
            if (parts[0] === "wiki" && parts[1]) {
                const title = decodeURIComponent(parts[1]).replace(/_/g, " ");
                return `${title} (Wikipedia)`;
            }
            return "Wikipedia Article";
        },
    };

    function autoLabel(url) {
        try {
            const domain = new URL(url).hostname.split(".").slice(-2).join(".");
            const generator = domainLabels[domain];
            if (generator) return generator(url);
            return `Auto-label not defined for URL: ${url}`;
        } catch (e) {
            return `Invalid URL: ${url} (${e})`;
        }
    }
</script>

<svelte:head>
    <title>{data.overview.name ?? "No name defined"}</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>{data.overview.name ?? "No name defined"}</h1>
        <span>{data.overview.description ?? "No description defined"}</span>
    </div>
</div>

<slot />

{#if data.overview.references}
    <div class="row">
        <div class="col">
            <hr/>

            <h2>References:</h2>
            <ul>
                {#each data.overview.references as ref}
                    <li>
                        {#if typeof ref === "string"}
                            <a href={ref} target="_blank">{autoLabel(ref)}</a>
                        {:else if typeof ref === "object"}
                            <a href={ref.url} target="_blank">{ref.label}</a>
                        {:else}
                            Unhandled reference <pre>{JSON.stringify(ref)}</pre>
                        {/if}
                    </li>
                {/each}
            </ul>
        </div>
    </div>
{/if}

<style>
</style>
