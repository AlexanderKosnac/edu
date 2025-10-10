<script>
    import ExifReader from "exifreader";

    let imageInput;

    let tags;

    async function loadExif() {
        const file = imageInput.files[0];
        const buffer = await file.arrayBuffer();

        tags = ExifReader.load(buffer, {
            async: true,
            expanded: true,
        });
    }
</script>

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
        <input bind:this={imageInput} type="file" class="form-control" id="img" name="img" accept="image/*" onchange={loadExif}>
        <button type="button" class="btn btn-primary" onclick={loadExif}>Load Exif</button>
    </div>
</div>

{#if tags}
<div class="row">
    <h2>Thumbnail</h2>
    {#if tags.Thumbnail}
        <div class="col">
            <img src="data:{tags.Thumbnail.type};base64, {tags.Thumbnail.base64}" alt="Thumbnail" />
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