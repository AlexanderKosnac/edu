<script>
    import { createEventDispatcher } from 'svelte';
    import MatrixBracket from './MatrixBracket.svelte';

    export let inputs;

    export function getEvalMatrix() {
        return inputs.map(i => i.map(j => j.fnEval()));
    }

    const dispatch = createEventDispatcher();

    const changeCallback = () => {
        dispatch("change");
    }
</script>

<div class="d-flex align-items-center">
    <MatrixBracket height="{inputs.length*32}" direction="l"/>

    <table class="matrix">
        {#each inputs as row, i}
        <tr>
            {#each row as element, j}
            <td>
                <div class="d-flex align-items-center justify-content-center">
                    {#if element.displayPrefix}
                    <span>{element.displayPrefix}</span>
                    {/if}

                    {#if element.editable}
                    <div class="field" bind:textContent={element.value} contenteditable on:focusout={changeCallback}></div>
                    {:else}
                    <div class="field">{element.value}</div>
                    {/if}

                    {#if element.displaySuffix}
                    <span>{element.displaySuffix}</span>
                    {/if}
                </div>
            </td>
            {/each}
        </tr>
        {/each}
    </table>

    <MatrixBracket height="{inputs.length*32}" direction="r"/>
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