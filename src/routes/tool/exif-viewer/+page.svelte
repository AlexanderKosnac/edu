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

    function openJson(data) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
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

<div class="row mb-1">
    <div class="col-auto">
        <div class="d-flex flex-row gap-1 align-items-center">
            <input bind:this={imageInput} type="file" class="form-control" id="img" name="img" accept="image/*" onchange={loadData}>
            <button type="button" class="btn btn-primary text-nowrap" onclick={loadData}>Load Data</button>
        </div>
    </div>
</div>

{#if tags}
<div class="row mb-1">
    <div class="col">
        <button type="button" class="btn btn-primary" onclick={() => openJson(tags)}>View JSON</button>
    </div>
</div>

<div class="row">
    <div class="col">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="thumbnail-tab" data-bs-toggle="tab" data-bs-target="#thumbnail" type="button" role="tab" aria-controls="thumbnail" aria-selected="true">Thumbnail</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="file-tab" data-bs-toggle="tab" data-bs-target="#file" type="button" role="tab" aria-controls="file" aria-selected="false">File</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="exif-tab" data-bs-toggle="tab" data-bs-target="#exif" type="button" role="tab" aria-controls="exif" aria-selected="false">Exif</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="icc-tab" data-bs-toggle="tab" data-bs-target="#icc" type="button" role="tab" aria-controls="icc" aria-selected="false">ICC</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="xmp-tab" data-bs-toggle="tab" data-bs-target="#xmp" type="button" role="tab" aria-controls="xmp" aria-selected="false">XMP</button>
            </li>
        </ul>
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="thumbnail" role="tabpanel" aria-labelledby="thumbnail-tab">
                {#if tags.Thumbnail}
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
                {:else}
                    No thumbnail data.
                {/if}
            </div>
            <div class="tab-pane fade" id="file" role="tabpanel" aria-labelledby="file-tab">
                {#if tags.file}
                    <div class="col">
                        {@render descriptionTable(tags.file)}
                    </div>
                {:else}
                    <div class="col">
                        No file data.
                    </div>
                {/if}
            </div>
            <div class="tab-pane fade" id="exif" role="tabpanel" aria-labelledby="exif-tab">
                {#if tags.exif}
                    <div class="col">
                        {@render descriptionTable(tags.exif)}
                    </div>
                {:else}
                    <div class="col">
                        No Exif data.
                    </div>
                {/if}
            </div>
            <div class="tab-pane fade" id="icc" role="tabpanel" aria-labelledby="icc-tab">
                {#if tags.icc}
                    <div class="col">
                        {@render descriptionTable(tags.icc)}
                    </div>
                {:else}
                    <div class="col">
                        No ICC data.
                    </div>
                {/if}
            </div>
            <div class="tab-pane fade" id="xmp" role="tabpanel" aria-labelledby="xmp-tab">
                {#if tags.xmp}
                    <div class="col">
                        {@render descriptionTable(tags.xmp)}
                    </div>
                {:else}
                    <div class="col">
                        No XMP data.
                    </div>
                {/if}
            </div>
        </div>
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