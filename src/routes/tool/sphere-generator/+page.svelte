<script>
    import { onMount } from "svelte";

    import { mat4 } from "gl-matrix";

    import { parseObjContent } from "$lib/objUtility";
    import { loadTexture } from "$lib/webglUtility";
    import { degToRad } from "$lib/math";

    import Canvas3D from "$lib/Canvas3D/Canvas3D.svelte";

    let inputRadius = 1;
    let inputLatitudeSegments = 8;
    let inputLongitudeSegments = 8;

    let gl;
    let objContent = "";

    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = 1;
    const zNear = 0.1;
    const zFar = 100.0;

    let projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const cameraPosition = [0, 0, 5];
    const target = [0, 0, 0];
    const up = [0, 1, 0];

    let viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, cameraPosition, target, up);

    let objects = [];

    function refreshObjects() {
        objects = [
            {
                mesh: parseObjContent(objContent),
                texture: null,
                color: [255, 0, 255, 255],
                state: {
                    rotation: 0,
                },
                tick(deltaTime) {
                    this.state.rotation += deltaTime * 10;
                    this.state.rotation %= 360;
                },
                getModelMatrix() {
                    const m = mat4.create();
                    mat4.rotate(m, m, degToRad(this.state.rotation * 2), [1, 0, 0]);
                    mat4.rotate(m, m, degToRad(this.state.rotation * 3), [0, 1, 0]);
                    mat4.rotate(m, m, degToRad(this.state.rotation * 4), [0, 0, 1]);
                    return m;
                },
            },
        ];
        loadTextures();
    }

    function loadTextures() {
        objects.forEach(o => {
            o.texture = loadTexture(gl, null, o.color);
        });
    }

    function generateSphereFromInputs() {
        objContent = generateSphere(inputLatitudeSegments, inputLongitudeSegments, inputRadius);
        refreshObjects();
    }

    function generateSphere(latSegments, lonSegments, radius = 1) {
        const vertices = [];
        const normals = [];
        const faces = [];

        for (let lat = 0; lat <= latSegments; lat++) {
            const theta = (lat * Math.PI) / latSegments;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let lon = 0; lon <= lonSegments; lon++) {
                const phi = (lon * 2 * Math.PI) / lonSegments;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const x = cosPhi * sinTheta;
                const y = cosTheta;
                const z = sinPhi * sinTheta;

                vertices.push(`v ${(radius * x).toFixed(5)} ${(radius * y).toFixed(5)} ${(radius * z).toFixed(5)}`);
                normals.push(`vn ${x.toFixed(5)} ${y.toFixed(5)} ${z.toFixed(5)}`);
            }
        }

        const getIndex = (lat, lon) => lat * (lonSegments + 1) + lon + 1;

        for (let lat = 0; lat < latSegments; lat++) {
            for (let lon = 0; lon < lonSegments; lon++) {
                const a = getIndex(lat, lon);
                const b = getIndex(lat + 1, lon);
                const c = getIndex(lat + 1, lon + 1);
                const d = getIndex(lat, lon + 1);

                faces.push(`f ${a}//${a} ${b}//${b} ${c}//${c}`);
                faces.push(`f ${a}//${a} ${c}//${c} ${d}//${d}`);
            }
        }

        return [...vertices, ...normals, ...faces].join('\n');
    }

    onMount(() => {
        refreshObjects();
        generateSphereFromInputs();
    });
</script>

<svelte:head>
    <title>Sphere Generator</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Sphere Generator</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto d-flex flex-column gap-1">
        <label>
            Radius:
            <input type="number" class="form-control" bind:value={inputRadius}
                on:change={generateSphereFromInputs}
                step="0.01" min="0.01"
                aria-label="Sphere radius input"/>
        </label>
        <label>
            Number of latitute segments:
            <input type="number" class="form-control" bind:value={inputLatitudeSegments}
                on:change={generateSphereFromInputs}
                step="1" min="3" aria-label="Ticks per second"/>
        </label>
        <label>
            Number of longitude segments:
            <input type="number" class="form-control" bind:value={inputLongitudeSegments}
                on:change={generateSphereFromInputs}
                step="1" min="3" aria-label="Ticks per second"/>
        </label>

        <div class="d-flex flex-column">
            {#if objects[0]}
            <span>Vertices: {objects[0].mesh.vertices.length}</span>
            <span>Faces: {objects[0].mesh.faces.length}</span>
            {/if}
        </div>
    </div>
    <div class="col">
        <textarea class="form-control font-monospace mb-1" rows="20" bind:value="{objContent}" readonly></textarea>
    </div>
    <div class="col-auto">
        <Canvas3D bind:gl={gl} bind:objects={objects} bind:projectionMatrix={projectionMatrix} bind:viewMatrix={viewMatrix} width={600} height={600} />
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