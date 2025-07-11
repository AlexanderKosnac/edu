<script>
  import data from "./aggregate-overview-data.json";

  import { base } from '$app/paths';

  const sortedData = data.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
</script>

<svelte:head>
    <title>edu</title>
</svelte:head>

<div class="row flex-row justify-content-center">
  <div class="col-lg-6">
    <div class="d-flex flex-column align-items-center">
      <h1 class="edu-title">edu</h1>

      <p>
        The edu project is a collection of tools, visualizations, and calculators with a focus on education and learning.
        The name is derived from the top-level domain <a href="https://en.wikipedia.org/wiki/.edu">.edu</a> which was created for organizations with a focus on education.
      </p>
      
      <p>
        This website is hosted on GitHub pages, automatically deployed from the <a href="https://github.com/AlexanderKosnac/edu">edu</a> repository.
        I do not guarantee the accuracy or correctness of the included tools or information.
      </p>
    </div>
  </div>
</div>

<div class="row justify-content-center mb-5">
  <div class="col-lg-10">
    <div class="d-flex flex-wrap justify-content-center gap-2">
      {#each sortedData as entry}
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
</div>

<style>
  .tool-card {
    width: 280px;
    min-width: 280px;
  }
  .edu-title {
    letter-spacing: .3rem;
    font-family: monospace;
    font-weight: 900;
  }
</style>