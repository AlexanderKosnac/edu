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
    <div class="col">
        <pre>{JSON.stringify(tags, null, 2)}</pre>
    </div>
</div>

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