
<script>
    import { onMount } from "svelte";

    import { mat4 } from "gl-matrix";

    import { parseObjContent, cube, tetrahedron } from "$lib/objUtility";
    import { loadTexture } from "$lib/webglUtility";
    import { degToRad } from "$lib/math";

    import Canvas3D from "$lib/Canvas3D/Canvas3D.svelte";

    const textureUrls = {
        "brick": "brick.png",
    };

    let gl;
    $: if (gl) {
        objects.forEach(o => o.texture = loadTexture(gl, textureUrls[o.texture], o.color));
    }

    let objContent = cube;

    let transformations = {
        translation: [0, 0, -10],   
        rotation: [0, 0, 0],
    };

    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = 1;
    const zNear = 0.1;
    const zFar = 100.0;

    let projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const cameraPosition = [0, 0, 0];
    const target = [0, 0, -1];
    const up = [0, 1, 0];

    let viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, cameraPosition, target, up);

    let objects = [];

    function loadContent(text) {
        objContent = text;
    }

    function renderContent() {
        objects = [
            {
                mesh: parseObjContent(objContent),
                texture: "brick",
                color: [1.0, 0.0, 1.0, 1.0],
                state: {
                },
                tick(deltaTime) {
                },
                getModelMatrix() {
                    const m = mat4.create();
                    mat4.translate(m, m, transformations.translation);
                    mat4.rotate(m, m, degToRad(transformations.rotation[0]), [0, 0, 1]);
                    mat4.rotate(m, m, degToRad(transformations.rotation[1]), [0, 1, 0]);
                    mat4.rotate(m, m, degToRad(transformations.rotation[2]), [1, 0, 0]);
                    return m;
                },
            },
        ];
    }

    onMount(() => {
        renderContent();
    });
</script>

<svelte:head>
    <title>.obj Renderer</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>.obj Renderer</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <Canvas3D bind:gl={gl} bind:objects={objects} bind:projectionMatrix={projectionMatrix} bind:viewMatrix={viewMatrix} width={600} height={600} />
    </div>
    <div class="col d-flex flex-column gap-1">
        <div class="d-flex flex-row gap-1">
            <button type="button" class="btn btn-primary" on:click={() => loadContent(cube)}>Cube</button>
            <button type="button" class="btn btn-primary" on:click={() => loadContent(tetrahedron)}>Tetrahedron</button>
        </div>

        <textarea class="form-control font-monospace mb-1" rows="20" bind:value="{objContent}"></textarea>

        Rotation:
        <div class="d-flex flex-row gap-1">
            <div class="d-flex flex-row gap-1 align-items-center">
                <input type="range" class="form-range" bind:value="{transformations.rotation[0]}" min="0" max="360">
                {transformations.rotation[0]}°
            </div>
            <div class="d-flex flex-row gap-1 align-items-center">
                <input type="range" class="form-range" bind:value="{transformations.rotation[1]}" min="0" max="360">
                {transformations.rotation[1]}°
            </div>
            <div class="d-flex flex-row gap-1 align-items-center">
                <input type="range" class="form-range" bind:value="{transformations.rotation[2]}" min="0" max="360">
                {transformations.rotation[2]}°
            </div>
        </div>

        Translation:
        <div class="d-flex flex-row gap-1">
            <input type="number" class="form-control" bind:value={transformations.translation[0]}>
            <input type="number" class="form-control" bind:value={transformations.translation[1]}>
            <input type="number" class="form-control" bind:value={transformations.translation[2]}>
        </div>

        <button type="button" class="btn btn-primary" on:click={renderContent}>Load</button>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://de.wikipedia.org/wiki/Wavefront_OBJ" target="_blank">Wavefront OBJ</a></li>
        </ul>
    </div>
</div>

<style>
</style>