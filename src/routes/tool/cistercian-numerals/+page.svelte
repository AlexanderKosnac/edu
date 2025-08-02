<script>
    import CistercianNumber from "$lib/CistercianNumber/CistercianNumber.svelte";

    let number = 1234;
</script>

<svelte:head>
    <title>Cistercian numerals</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Cistercian numerals</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <CistercianNumber bind:number={number} size="256"/>
    </div>
    <div class="col">
        <label>
            Number:
            <input type="number" class="form-control" bind:value={number} min="1" max="9999"/>
        </label>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Cistercian_numerals" target="_blank">Cistercian numerals</a></li>
        </ul>
    </div>
</div>

<style>
</style>