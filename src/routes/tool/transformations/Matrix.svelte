<script>
    import { createEventDispatcher } from 'svelte';
    import MatrixBracket from './MatrixBracket.svelte';

    export let matrix;
    export let editable = matrix.map(row => row.map(_ => false));

    const dispatch = createEventDispatcher();

    const changeCallback = () => {
        dispatch("change");
    }
</script>

<div class="d-flex flex-row align-items-center">
    <MatrixBracket height="{matrix.length*32}" direction="l"/>

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

    <MatrixBracket height="{matrix.length*32}" direction="r"/>
</div>

<style>
    .matrix > tr > td {
        padding: 2px;
        font-size: 1.2em;
        font-family: "Computer Modern";
        font-style: italic;
    }
    .field {
        border-width: 1px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;

        min-width: 25px;
        height: 25px;

        padding-left: 5px;
        padding-right: 5px;
    }
    .field[contenteditable] {
        border-style: dashed;
        border-color: var(--bs-body-color);
        font-weight: 900;
        margin-left: 5px;
        margin-right: 5px;
    }
</style>