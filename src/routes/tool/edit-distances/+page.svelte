<script>
    let string1 = "";
    let string2 = "";
</script>

<svelte:head>
    <title>Edit distance</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Edit distance</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="d-flex flex-column">
            <label>
                Text 1:
                <input type="text" class="form-control font-monospace" bind:value={string1} />
            </label>

            <label>
                Text 2:
                <input type="text" class="form-control font-monospace" bind:value={string2} />
            </label>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Edit_distance" target="_blank">Edit distance</a></li>
        </ul>
    </div>
</div>

<style>
</style>