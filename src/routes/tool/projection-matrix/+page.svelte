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

    let gl;

    let baseYOffset = -1;

    const cubeMesh = parseObjContent(unitCubeCentered);

    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = 1;
    const zNear = 0.1;
    const zFar = 100.0;

    let projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    let objects = [];

    const transformations = {
        objA: {
            translation: [0, baseYOffset, -5],
        },
        objB: {
            translation: [0, baseYOffset, -6],
        },
        objC: {
            translation: [0, baseYOffset, -7],
        },
        objD: {
            translation: [0, baseYOffset, -8],
        },
        orbiter: {
            translation: [0, baseYOffset, -8],
            rotation: 0,
        }
    };

    function refreshObjects() {
        objects = [
            {
                mesh: cubeMesh,
                texture: null,
                color: [255, 0, 255, 255],
                state: {
                },
                tick(deltaTime) {
                    transformations.orbiter.rotation += deltaTime * 100;
                    transformations.orbiter.rotation %= 360;
                },
                getModelViewMatrix() {
                    const m = mat4.create();
                    mat4.rotate(m, m, degToRad(transformations.orbiter.rotation), [0, 1, 0]);
                    mat4.translate(m, m, [0, baseYOffset, -10]);
                    return m;
                },
            },
            {
                mesh: cubeMesh,
                texture: null,
                color: [255, 0, 0, 255],
                state: {
                },
                tick(deltaTime) {
                },
                getModelViewMatrix() {
                    const m = mat4.create();
                    mat4.translate(m, m, transformations.objA.translation);
                    return m;
                },
            },
            {
                mesh: cubeMesh,
                texture: null,
                color: [0, 255, 0, 255],
                state: {
                },
                tick(deltaTime) {
                },
                getModelViewMatrix() {
                    const m = mat4.create();
                    mat4.translate(m, m, transformations.objB.translation);
                    return m;
                },
            },
            {
                mesh: cubeMesh,
                texture: null,
                color: [0, 0, 255, 255],
                state: {
                },
                tick(deltaTime) {
                },
                getModelViewMatrix() {
                    const m = mat4.create();
                    mat4.translate(m, m, transformations.objC.translation);
                    return m;
                },
            },
            {
                mesh: cubeMesh,
                texture: null,
                color: [0, 255, 255, 255],
                state: {
                },
                tick(deltaTime) {
                },
                getModelViewMatrix() {
                    const m = mat4.create();
                    mat4.translate(m, m, transformations.objD.translation);
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

    onMount(() => {
        refreshObjects();
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
        <Canvas3D bind:gl={gl} bind:objects={objects} bind:projectionMatrix={projectionMatrix} width={600} height={600} />
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
</style>