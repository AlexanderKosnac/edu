<script>
    import ExifReader from "exifreader";

    let imageInput;

    let tags;

    async function loadData() {
        const file = imageInput.files[0];
        const buffer = await file.arrayBuffer();

        tags = ExifReader.load(buffer, {
            async: true,
            expanded: true,
            includeUnknown: true,
        });
    }
</script>

{#snippet descriptionTable(obj)}
<table class="table table-bordered w-auto mt-1">
    <thead>
        <tr>
            <th>Field</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        {#each Object.entries(obj) as [name, data]}
            <tr>
                <td>{name}</td>
                <td>{data.description ?? data}</td>
            </tr>
        {/each}
    </tbody>
</table>

{/snippet}

<svelte:head>
    <title>Exif Viewer</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Exif Viewer</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <div class="d-flex flex-row gap-1 align-items-center">
            <input bind:this={imageInput} type="file" class="form-control" id="img" name="img" accept="image/*" onchange={loadData}>
            <button type="button" class="btn btn-primary text-nowrap" onclick={loadData}>Load Data</button>
        </div>
    </div>
</div>

{#if tags}
<div class="row">
    <h2>Thumbnail</h2>
    {#if tags.Thumbnail}
        <div class="col">
            <table class="table table-bordered w-auto mt-1">
                <tbody>
                    <tr>
                        <td>Thumbnail</td>
                        <td><img src="data:{tags.Thumbnail.type};base64, {tags.Thumbnail.base64}" alt="Thumbnail" /></td>
                    </tr>
                    <tr>
                        <td>Base64</td>
                        <td><input type="text" class="form-control" value={tags.Thumbnail.base64} readonly/></td>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td><samp>{tags.Thumbnail.type}</samp></td>
                    </tr>
                </tbody>
            </table>
            {@render descriptionTable(tags.Thumbnail)}
        </div>
        <div class="col">
            <pre>{JSON.stringify(tags.Thumbnail, null, 2)}</pre>
        </div>
    {:else}
        <div class="col">
            No thumbnail data.
        </div>
    {/if}        
</div>

<div class="row">
    <h2>File</h2>
    {#if tags.file}
        <div class="col">
            {@render descriptionTable(tags.file)}
        </div>
        <div class="col">
            <pre>{JSON.stringify(tags.file, null, 2)}</pre>
        </div>
    {:else}
        <div class="col">
            No file data.
        </div>
    {/if}
</div>

<div class="row">
    <h2>Exif</h2>
    {#if tags.exif}
        <div class="col">
            {@render descriptionTable(tags.exif)}
        </div>
        <div class="col">
            <pre>{JSON.stringify(tags.exif, null, 2)}</pre>            
        </div>
    {:else}
        <div class="col">
            No Exif data.
        </div>
    {/if}
</div>

<div class="row">
    <h2>ICC</h2>
    {#if tags.icc}
        <div class="col">
            {@render descriptionTable(tags.icc)}
        </div>
        <div class="col">
            <pre>{JSON.stringify(tags.icc, null, 2)}</pre>
        </div>
    {:else}
        <div class="col">
            No ICC data.
        </div>
    {/if}
</div>

<div class="row">
    <h2>XMP</h2>
    {#if tags.xmp}
        <div class="col">
            {@render descriptionTable(tags.xmp)}
        </div>
        <div class="col">
            <pre>{JSON.stringify(tags.xmp, null, 2)}</pre>
        </div>
    {:else}
        <div class="col">
            No XMP data.
        </div>
    {/if}
</div>
{/if}

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Exif" target="_blank">Exif</a></li>
            <li><a href="https://www.npmjs.com/package/exifreader/v/3.2.0" target="_blank">exifreader npm package</a></li>
        </ul>
    </div>
</div>

<style>
</style>