<script>
    import { createEventDispatcher } from "svelte";

    export let identifier;
    export let value;
    export let min;
    export let max;
    export let step;

    const dispatch = createEventDispatcher();

    const inputCallback = () => {
        dispatch("input");
    }
</script>

<div class="d-flex align-items-center gap-2">
    <span class="identifier text-center">{identifier}</span>
    <input type="range" {min} {max} {step} bind:value on:input={inputCallback}/>
    <span class="value">{value}</span>
</div>

<style>
    .identifier {
        width: 1em;
        font-weight: 900;
    }
    .value {
        width: 3em;
    }
</style>