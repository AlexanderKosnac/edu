<script>
    import { onMount } from "svelte";

    let angle = 0;

    let canvas;

    let objContent = `\
v 0.0 0.0 0.0
v 0.0 1.0 0.0
v 1.0 1.0 0.0
v 1.0 0.0 0.0
v 0.0 0.0 1.0
v 0.0 1.0 1.0
v 1.0 1.0 1.0
v 1.0 0.0 1.0

f 3 7 8
f 3 8 4
f 1 5 6
f 1 6 2
f 7 3 2
f 7 2 6
f 4 8 5
f 4 5 1
f 8 7 6
f 8 6 5
f 3 4 1
f 3 1 2`;

    function parseObjContent(text) {
        const positions = [];
        const indices = [];

        for (const line of text.trim().split("\n")) {
            const parts = line.trim().split(/\s+/);
            if (parts[0] === "v") {
                positions.push(...parts.slice(1).map(Number));
            } else if (parts[0] === "f") {
                const face = parts.slice(1).map(p => parseInt(p) - 1);
                if (face.length === 3) {
                    indices.push(...face);
                } else if (face.length === 4) {
                    indices.push(face[0], face[1], face[2]);
                    indices.push(face[0], face[2], face[3]);
                }
            }
        }
        return { positions, indices };
    }

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

    const vsSource = `
attribute vec3 aPosition;
uniform mat4 uProjection;
uniform mat4 uModelView;
void main() {
    gl_Position = uProjection * uModelView * vec4(aPosition, 1.0);
}`;

        const fsSource = `
precision mediump float;
void main() {
    gl_FragColor = vec4(0.3, 0.8, 0.9, 1.0);
}`;

    function load() {
        const gl = canvas.getContext("webgl");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);

        const { positions, indices } = parseObjContent(objContent);

        function createShader(type, src) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw new Error(gl.getShaderInfoLog(shader));
            }
            return shader;
        }

        const vs = createShader(gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl.FRAGMENT_SHADER, fsSource);

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

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
            mat4_rotateY(model, angle);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.uniformMatrix4fv(uProjection, false, proj);
            gl.uniformMatrix4fv(uModelView, false, model);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
            requestAnimationFrame(render);
        }

        render(0);
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