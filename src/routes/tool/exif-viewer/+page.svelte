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
    <div class="col">
        {#if tags.Thumbnail}
            <img src="data:{tags.Thumbnail.type};base64, {tags.Thumbnail.base64}" alt="Thumbnail" />
        {:else}
            No thumbnail data.
        {/if}
    </div>
</div>

<div class="row">
    <h2>File</h2>
    <div class="col">
        {#if tags.file}
            <pre>{JSON.stringify(tags.file, null, 2)}</pre>
        {:else}
            No thumbnail data.
        {/if}
    </div>
</div>

<div class="row">
    <h2>Exif</h2>
    <div class="col">
        {#if tags.exif}
            <pre>{JSON.stringify(tags.exif, null, 2)}</pre>
        {:else}
            No Exif data.
        {/if}
    </div>
</div>

<div class="row">
    <h2>ICC</h2>
    <div class="col">
        {#if tags.icc}
            <pre>{JSON.stringify(tags.icc, null, 2)}</pre>
        {:else}
            No ICC data.
        {/if}
    </div>
</div>

<div class="row">
    <h2>XMP</h2>
    <div class="col">
        {#if tags.xmp}
            <pre>{JSON.stringify(tags.xmp, null, 2)}</pre>
        {:else}
            No XMP data.
        {/if}
    </div>
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