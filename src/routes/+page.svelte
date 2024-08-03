<script>
    import data from "./tool/overview-data.json";

    const sortedData = data.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
</script>

<h1><tt style="letter-spacing: .4rem">edu</tt></h1>

<p>
  EDU is a collection of tools, visualizations, and calculators with a focus on education and learning.
  The name is derived from top-level domain <a href="https://en.wikipedia.org/wiki/.edu">.edu</a> which was created for organizations with a focus on education.
</p>

<p>
  This website is hosted on GitHub pages, automatically deployed from the <a href="https://github.com/AlexanderKosnac/edu">edu</a> repository.
</p>

<div class="d-flex flex-wrap gap-2">
  {#each sortedData as entry}
  {#if entry.usable ?? true}
  <div class="card tool-card">
    <div class="card-body">
      <h5 class="card-title">
        <a class="icon-link icon-link-hover" href="{entry.url}">
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

<style>
.tool-card {
  width: 18rem;
  min-width: 18rem;
}
</style>