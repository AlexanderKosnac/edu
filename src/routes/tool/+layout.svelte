<script>
    export let data;
</script>

<svelte:head>
    <title>{data.overview.name ?? "No name defined"}</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>{data.overview.name ?? "No name defined"}</h1>
    </div>
</div>

<slot />

<style>
</style>
