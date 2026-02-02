<script>
    import { base } from "$app/paths";

    import data from "./aggregate-overview-data.json";

    const dataSorted = data.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
</script>

<div class="row justify-content-center">
    <div class="col col-md-6 d-flex flex-column align-items-start">
        <span class="edu-title align-self-center">edu</span>

        <p>edu is a growing collection of educational tools, visualizations, calculators, and small utilities. The goal is transparency of underlying processes and concepts, rather than efficient or production-ready implementations.</p>

        <p>
            The name is derived from the top-level domain <a href="https://en.wikipedia.org/wiki/.edu">.edu</a>, which was created for organizations with a focus on education.
        </p>

        <p>
            This website is hosted on GitHub Pages and automatically deployed from the <a href="https://github.com/AlexanderKosnac/edu">edu</a> repository.
        </p>

        <p>No guarantee is made regarding the accuracy or correctness of the provided tools or information.</p>
    </div>
</div>

<div class="row justify-content-center">
    <div class="col d-flex flex-wrap justify-content-center gap-2">
        {#each dataSorted as entry}
            {#if entry.usable ?? true}
                <div class="card tool-card">
                    <div class="card-body">
                        <h5 class="card-title">
                            <a class="icon-link icon-link-hover" href="{base}/{entry.url}">
                                {entry.name}
                                <i class="bi bi-arrow-right-short"></i>
                            </a>
                        </h5>
                        <p class="card-text">{entry.description}</p>
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    .edu-title {
        letter-spacing: 0.3rem;
        font-family: monospace;
        font-weight: 900;
        font-size: 2.2em;
    }

    .tool-card {
        width: 100%;
    }

    @media (min-width: 576px) {
        .tool-card {
            width: 290px;
        }
    }
</style>
