<script>
    import { onMount } from "svelte";

    import { parseObjContent, cube } from "$lib/objUtility";
    import { createShader } from "$lib/webglUtility";

    let angle = 0;

    let canvas;

    let objContent = cube;

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

    function mat4_translateAndRotate(out, angle, translation = [0, 0, 0]) {
        const rad = angle * (Math.PI/180.0);
        const c = Math.cos(rad);
        const s = Math.sin(rad);

        const t = translation;

        out.set([
               c,    0,    s, 0,
               0,    1,    0, 0,
              -s,    0,    c, 0,
            t[0], t[1], t[2], 1
        ]);
        return out;
    }

    const vsSource = `\
attribute vec3 aPosition;
uniform mat4 uProjection;
uniform mat4 uModelView;

void main() {
    gl_Position = uProjection * uModelView * vec4(aPosition, 1.0);
}`;

        const fsSource = `\
precision mediump float;

void main() {
    gl_FragColor = vec4(0.3, 0.8, 0.9, 1.0);
}`;

    function load() {
        const gl = canvas.getContext("webgl");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);

        const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

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

        const verticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices.flatMap(i => i)), gl.STATIC_DRAW);

        const indices = faces.flatMap(f => f.vertices.map(v => v.v));

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

        const uProjection = gl.getUniformLocation(program, "uProjection");
        const uModelView = gl.getUniformLocation(program, "uModelView");

        const proj = new Float32Array(16);
        const model = new Float32Array(16);
        mat4_perspective(proj, Math.PI / 4, canvas.width / canvas.height, 0.1, 100);

        gl.enable(gl.DEPTH_TEST);

        function render() {
            mat4_translateAndRotate(model, angle, [0, -0.5, -5]);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.uniformMatrix4fv(uProjection, false, proj);
            gl.uniformMatrix4fv(uModelView, false, model);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
            requestAnimationFrame(render);
        }

        render();
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