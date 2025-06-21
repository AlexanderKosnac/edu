<script>
    import { onMount } from "svelte";

    import { parseObjContent, cube } from "$lib/objUtility";
    import { vsSource, fsSource, initShaderProgram, loadTexture } from "$lib/webglUtility";

    import { initBuffers } from "./BufferInit";
    import { drawScene } from "./RenderLoop";

    let angle = 0;

    let canvas;

    let objContent = cube;

    let cubeRotation = 0.0;
    let deltaTime = 0;

    let textureUrl = "brick.png";

    function load() {
        const gl = canvas.getContext("webgl");
        if (gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }

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

        const buffers = initBuffers(gl);
        const texture = loadTexture(gl, textureUrl);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        let then = 0;

        function render(now) {
            now *= 0.001; // Time in seconds
            deltaTime = now - then;
            then = now;

            drawScene(gl, programInfo, buffers, texture, cubeRotation);
            cubeRotation += deltaTime;

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);

        // ------------------------

        /*

        const {
            vertices,
            texcoords,
            normals,
            parameterSpaceVertices,
            faces,
            lines,
            points,
            metadata,
        } = parseObjContent(objContent);
         */
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
            console.log(angle);
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