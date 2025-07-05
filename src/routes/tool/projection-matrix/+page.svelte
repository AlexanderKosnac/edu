<script>
    /*
    function mat4_perspective(out, fovy, aspect, near, far) {
        const f = 1.0 / Math.tan(fovy / 2);
        const nf = 1 / (near - far);
        out.set([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, (2 * far * near) * nf, 0
        ]);
        return out;
    }

    function mat4_rotateY(out, angle) {
        const rad = angle * (Math.PI/180.0);
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        out.set([
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, -3, 1
        ]);
        return out;
    }
    */

    import { onMount } from "svelte";

    import { mat4 } from "gl-matrix";

    import { parseObjContent, unitCubeCentered } from "$lib/objUtility";
    import { loadTexture } from "$lib/webglUtility";
    import { degToRad } from "$lib/math";

    import Canvas3D from "$lib/Canvas3D/Canvas3D.svelte";

    const width = 600;
    const height = 600;
    const svgWidth = 10;
    const svgHeight = 10;

    let gl;
    $: if (gl) {
        objects.forEach(o => o.texture = loadTexture(gl, null, o.color));
    }

    let baseYOffset = -1;

    const cubeMesh = parseObjContent(unitCubeCentered);

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

    onMount(() => {
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
    <div class="col">
        <Canvas3D bind:gl={gl} bind:objects={objects} bind:projectionMatrix={projectionMatrix} bind:viewMatrix={viewMatrix} {width} {height} />
    </div>
    <div class="col">
        <svg id="canvas2d" {width} {height} viewBox="-{svgWidth/2} -{svgHeight/2} {svgWidth} {svgHeight}" transform="scale(-1,1)">
            <line class="axis" x1="0" y1="0" x2="0"           y2="{svgHeight}"  stroke="black" />
            <line class="axis" x1="0" y1="0" x2="{svgWidth}"  y2="0"            stroke="black" />
            <line class="axis" x1="0" y1="0" x2="-{svgWidth}" y2="0"            stroke="black" />
            <line class="axis" x1="0" y1="0" x2="0"           y2="-{svgHeight}" stroke="black" />

            {#each Object.entries(objects) as [_, obj]}
            <rect x="-0.5" y="-0.5" width="1" height="1" fill="rgb({obj.color})"
                transform="rotate({obj.state?.rotation === undefined ? 0 : orbiterRotation} 0 0)translate({obj.state.translation[0]} {obj.state.translation[2]})">
            </rect>
            {/each}
        </svg>
    </div>
    <div class="col">
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://www.songho.ca/opengl/gl_projectionmatrix.html" target="_blank">Article on OpenGL Projectionmatrices</a></li>
            <li><a href="http://learnwebgl.brown37.net/08_projections/projections_perspective.html" target="_blank">Article on perspective projection</a></li>
        </ul>
    </div>
</div>

<style>
    #canvas2d {
        border: 1px solid var(--bs-body-color);
        background-color: black;
    }
    .axis {
        stroke: var(--bs-body-color);
        stroke-width: 0.05;
    }
</style>