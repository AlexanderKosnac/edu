<script>
    export let name;
    export let values;
</script>

<div class="d-flex flex-column border border-3 p-1">
    <span class="fw-bold text-center font-monospace">{name}</span>
    {#each values as val}
    <div class="d-flex justify-content-between gap-1">
        <div>{val[0]}:</div>
        <div>{val[1]}{val[2] ?? ""}</div>
    </div>
    {/each}
</div>

<style>
</style>