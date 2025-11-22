<script>
    import { md5 } from "hash-wasm";

    let results = {};

    async function handleFile(event) {
        results = {};

        const files = event.target.files;
        if (!files.length)
            return;


        for (let file of files) {
            const buffer = await file.arrayBuffer();
            const bytes = new Uint8Array(buffer);

            results[file.name] = {
                md5: await md5(bytes),
            };
        }
    }
</script>

<svelte:head>
    <title>File CRCs</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>File CRCs</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <input type="file" class="form-control" id="img" name="img" accept="*/*" multiple onchange={handleFile}>

        {#if Object.keys(results).length > 0}
            {#each Object.keys(results) as [file, crcs]}
                <h2>Results for: {file}</h2>
                {#each Object.keys(crcs) as [name, value]}
                    {name}: {value}<br>
                {/each}
            {/each}
        {/if}
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Checksum" target="_blank">Checksum</a></li>
        </ul>
    </div>
</div>

<style>
</style>