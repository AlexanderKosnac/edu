<script>
    import { onMount } from "svelte";

    import { mat4 } from "gl-matrix";

    import { parseObjContent, cube, pyramid } from "$lib/objUtility";
    import { vsSource, fsSource, initShaderProgram, loadTexture } from "$lib/webglUtility";

    import { drawScene } from "./RenderLoop";

    let angle = 0;

    let canvas;

    let objContent = cube;

    let deltaTime = 0;

    let textureUrl = "brick.png";

    function load() {
        const gl = canvas.getContext("webgl");
        if (gl === null) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            return;
        }

        const fieldOfView = (45 * Math.PI) / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;

        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        const objects = [
            {
                mesh: parseObjContent(objContent),
                texture: loadTexture(gl, textureUrl),
                state: {
                    rotation: 0,
                    position: [0, 0, -6],
                },
                tick(deltaTime) {
                    this.state.rotation += deltaTime;
                },
                getModelViewMatrix() {
                    const m = mat4.create();
                    mat4.translate(m, m, this.state.position);
                    mat4.rotate(m, m, this.state.rotation * 1.0, [0, 0, 1]);
                    mat4.rotate(m, m, this.state.rotation * 0.7, [0, 1, 0]);
                    mat4.rotate(m, m, this.state.rotation * 0.3, [1, 0, 0]);
                    return m;
                },
            },
        ];

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
                textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
                uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
            },
        };

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        let then = 0;

        function render(now) {
            now *= 0.001; // Time in seconds
            deltaTime = now - then;
            then = now;

            objects.forEach(function(obj) {
                obj.tick(deltaTime);
            });

            drawScene(gl, programInfo, objects, projectionMatrix);

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }

    let isRunning = false;

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function startAutoRotate() {
        if (isRunning)
            return;
        isRunning = true;

        while (isRunning) {
            await delay(50);
            angle = (angle + 1) % 360;
        }
    }

    function stopAutoRotate() {
        isRunning = false;
    }

    function toggleAutoRotate() {
        isRunning ? stopAutoRotate() : startAutoRotate();
    }

    onMount(() => {
        load();
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
        <canvas bind:this={canvas}></canvas>
    </div>
    <div class="col">
        <textarea class="form-control font-monospace mb-1" rows="20" bind:value="{objContent}"></textarea>
        <div class="d-flex flex-row gap-1 align-items-center">
            <button type="button" class="btn btn-primary" on:click={load}>Load</button>
            <input type="range" class="form-range" bind:value="{angle}" min="0" max="360">
            <button type="button" class="btn btn-sm btn-primary" on:click={toggleAutoRotate}>
                {isRunning ? "Stop" : "Start"} Rotate
            </button>
        </div>
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
    canvas {
        width: 600px;
        height: 600px;
        border: 1px solid #444;
        display: block;
    }
</style>