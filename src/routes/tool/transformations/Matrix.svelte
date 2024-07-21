<script>
    import { createEventDispatcher } from 'svelte';

    export let matrix;
    export let editable = matrix.map(row => row.map(e => false));

    const dispatch = createEventDispatcher();

    const changeCallback = () => {
        dispatch("change");
    }
</script>

<div class="d-flex flex-column gap-1">
    {#each matrix as row, i}
    <div class="d-flex gap-1">
        {#each row as element, j}
            {#if editable[i][j]}
            <div class="field" bind:textContent={element} contenteditable on:focusout={changeCallback}></div>
            {:else}
            <div class="field">{element}</div>
            {/if}
        {/each}
    </div>
    {/each}
</div>

<style>
    .field {
        border-width: 1px;
        border-style: solid;
        border-color: #555555;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;

        min-width: 45px;
        height: 45px;

        padding-left: 5px;
        padding-right: 5px;

        font-size: 1.2em;
    }
    .field[contenteditable] {
        border-color: white;
        font-weight: 900;
    }
</style>