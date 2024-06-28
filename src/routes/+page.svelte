<script>
    import data from "./tool/overview-data.json";

    const sortedData = data.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
</script>

<h1><tt>EDU</tt></h1>

<p>
    EDU is a collection of tools, visualizations, and implementations with a focus on education and learning.
</p>

<p>
    This website is hosted on GitHub pages, automatically deployed from the <a href="https://github.com/AlexanderKosnac/edu">edu</a> repository.
</p>

<div class="d-flex flex-wrap gap-2">
  {#each sortedData as entry}
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
  {/each}
</div>

<style>
.tool-card {
  width: 18rem;
  min-width: 18rem;
}
</style>