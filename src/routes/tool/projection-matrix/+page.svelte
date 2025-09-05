<script>
    import { onMount } from "svelte";

    import { mat4 } from "gl-matrix";

    import { katexAsHtml, toKatexMatrix, toKatexVector } from "$lib/katexUtility.js";
    import { parseObjContent, unitCubeCentered } from "$lib/objUtility";
    import { loadTexture } from "$lib/webglUtility";
    import { degToRad } from "$lib/math";

    import Canvas3D from "$lib/Canvas3D/Canvas3D.svelte";

    const width = 600;
    const height = 600;
    const svgWidth = 14;
    const svgHeight = 14;

    let fovInput = 45;
    let zNearInput = 0.1;
    let zFarInput = 100.0;

    let gl;
    $: if (gl) {
        objects.forEach(o => o.texture = loadTexture(gl, null, o.color));
    }

    let baseYOffset = -1;

    const cubeMesh = parseObjContent(unitCubeCentered);

    let projectionMatrix = mat4.create();

    const cameraPosition = [0, 0, 5];
    const target = [0, 0, 0];
    const up = [0, 1, 0];

    let viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, cameraPosition, target, up);

    let orbiterRotation = 0;

    let objects = [
        {
            mesh: cubeMesh,
            texture: null,
            color: [255, 0, 255, 255],
            state: {
                translation: [0, baseYOffset, -4],
                rotation: orbiterRotation,
            },
            tick(deltaTime) {
                this.state.rotation += deltaTime * 100;
                this.state.rotation %= 360;
                orbiterRotation = this.state.rotation;
            },
            getModelMatrix() {
                const m = mat4.create();
                mat4.rotate(m, m, degToRad(this.state.rotation), [0, 1, 0]);
                mat4.translate(m, m, this.state.translation);
                return m;
            },
        },
        {
            mesh: cubeMesh,
            texture: null,
            color: [255, 0, 0, 255],
            state: {
                translation: [2, baseYOffset, 0],
            },
            tick(deltaTime) {
            },
            getModelMatrix() {
                const m = mat4.create();
                mat4.translate(m, m, this.state.translation);
                return m;
            },
        },
        {
            mesh: cubeMesh,
            texture: null,
            color: [0, 255, 0, 255],
            state: {
                translation: [0, baseYOffset, -2],
            },
            tick(deltaTime) {
            },
            getModelMatrix() {
                const m = mat4.create();
                mat4.translate(m, m, this.state.translation);
                return m;
            },
        },
        {
            mesh: cubeMesh,
            texture: null,
            color: [0, 0, 255, 255],
            state: {
                translation: [-2, baseYOffset, 0],
            },
            tick(deltaTime) {
            },
            getModelMatrix() {
                const m = mat4.create();
                mat4.translate(m, m, this.state.translation);
                return m;
            },
        },
        {
            mesh: cubeMesh,
            texture: null,
            color: [255, 255, 255, 255],
            state: {
                translation: [0, baseYOffset, 0],
            },
            tick(deltaTime) {
            },
            getModelMatrix() {
                const m = mat4.create();
                mat4.translate(m, m, this.state.translation);
                return m;
            },
        },
    ];

    function chunkArray(array, n) {
        if (n <= 0)
            throw new Error("n must be greater than 0");
        const result = [];
        for (let i = 0; i < array.length; i += n) {
            result.push(array.slice(i, i + n));
        }
        return result;
    }

    function constructProjectionMatrixFromInputs() {
        projectionMatrix = mat4.create();

        const fieldOfView = (fovInput * Math.PI) / 180;
        const aspect = 1;
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNearInput, zFarInput);
    }

    onMount(() => {
        constructProjectionMatrixFromInputs();
    });
</script>

<svelte:head>
    <title>Projection Matrix</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Projection Matrix</h1>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <Canvas3D bind:gl={gl} bind:objects={objects} bind:projectionMatrix={projectionMatrix} bind:viewMatrix={viewMatrix} {width} {height} />
    </div>
    <div class="col-auto">
        <svg id="canvas2d" {width} {height} viewBox="-{svgWidth/2} -{svgHeight/2} {svgWidth} {svgHeight}" transform="scale(-1,1)">
            <line class="axis" x1="0" y1="0" x2="0" y2="{svgHeight}"/>
            <line class="axis" x1="0" y1="0" x2="{svgWidth}" y2="0"/>
            <line class="axis" x1="0" y1="0" x2="-{svgWidth}" y2="0"/>
            <line class="axis" x1="0" y1="0" x2="0" y2="-{svgHeight}"/>

            <line class="axis" x1={cameraPosition[0] - svgWidth} y1={cameraPosition[2] - zNearInput} x2={svgWidth} y2={cameraPosition[2] - zNearInput}/>
            <line class="axis" x1={cameraPosition[0] - svgWidth} y1={cameraPosition[2] - zFarInput} x2={svgWidth} y2={cameraPosition[2] - zFarInput}/>

            {#each Object.entries(objects) as [_, obj]}
            <rect x="-0.5" y="-0.5" width="1" height="1" fill="rgb({obj.color})"
                transform="rotate({obj.state?.rotation === undefined ? 0 : orbiterRotation} 0 0)translate({obj.state.translation[0]} {obj.state.translation[2]})">
            </rect>
            {/each}

            <path class="camera" d="M -2 -2 h 4 v 3 h -1 l 1 1 h -4 l 1 -1 h -1 v -3"
                transform="translate({cameraPosition[0]}, {cameraPosition[2]})scale(.2)rotate(180)"/>
        </svg>
    </div>
    <div class="col">
        <div class="d-flex flex-column">
            <label>
                Field of View (°):
                <input type="number" class="form-control" bind:value={fovInput} min="0" max="360" on:change={constructProjectionMatrixFromInputs}/>
            </label>
            <label>
                Z Near:
                <input type="number" class="form-control" bind:value={zNearInput} step="0.1" on:change={constructProjectionMatrixFromInputs}/>
            </label>
            <label>
                Z Far:
                <input type="number" class="form-control" bind:value={zFarInput} step="0.1" on:change={constructProjectionMatrixFromInputs}/>
            </label>
        </div>
        Projection:
        {@html katexAsHtml(toKatexMatrix(chunkArray(projectionMatrix, 4)))}
        View:
        {@html katexAsHtml(toKatexMatrix(chunkArray(viewMatrix, 4)))}
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://www.songho.ca/opengl/gl_projectionmatrix.html" target="_blank">Article on OpenGL Projectionmatrices</a></li>
            <li><a href="http://learnwebgl.brown37.net/08_projections/projections_perspective.html" target="_blank">Article on perspective projection</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Orthographic_projection" target="_blank">Orthographic projection</a></li>
        </ul>
    </div>
</div>

<style>
    #canvas2d {
        border: 1px solid var(--bs-body-color);
        background-color: black;
    }
    .camera {
        stroke: var(--bs-body-color);
        stroke-width: 0.05;
        fill: var(--bs-body-color);
    }
    .axis {
        stroke: var(--bs-body-color);
        stroke-width: 0.05;
    }
</style>