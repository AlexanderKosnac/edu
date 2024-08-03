<script>
    export let data;
    export let size = "normal";
</script>

<div class="token {size}">
    <div class="symbol">{data.symbol}</div>
    {#if size === "normal"}
    <div class="type">{data.type.name}</div>
    {/if}
</div>

<style>
    .token {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        position: relative;

        min-width: 40px;
        height: 40px;
        border: 1px solid var(--bs-body-color);
        border-radius: 5px;
    }
    .token.small {
        min-width: 25px;
        height: 25px;
    }
    .token > .symbol {
        padding: 0px 5px 15px;
        font-size: 1.4em;
        font-weight: 900;
    }
    .token.small > .symbol {
        padding: 0px;
        font-size: 1.3em;
        font-weight: 900;
    }
    .token > .type {
        position: absolute;
        top: 65%;
        font-size: .5em;
        font-weight: 900;
    }
</style>
