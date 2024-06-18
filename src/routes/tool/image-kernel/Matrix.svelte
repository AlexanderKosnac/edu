<script>
export let matrix;
</script>

<div class="d-flex flex-column gap-1">
    {#each matrix as row, i}
    <div class="d-flex flex-row gap-1">
        {#each row as _, j}
            <span class="matrix-entry border">{matrix[i][j]}</span>
        {/each}
    </div>
    {/each}
</div>

<style>
    .matrix-entry {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
    }
</style>