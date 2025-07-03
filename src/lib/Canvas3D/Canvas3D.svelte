<script>
    import { onMount } from "svelte";

    import { initShaderProgram, vsSource, fsSource } from "$lib/webglUtility";
    import { drawScene } from "./Renderer";

    let {
        gl = $bindable(),
        objects = $bindable(),
        projectionMatrix = $bindable(),
        width = 600,
        height = 600,
        ...others
    } = $props();

    let canvas;

    onMount(() => {
        const ctx = canvas.getContext("webgl");
        if (!ctx) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            return;
        }
        gl = ctx;

        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);

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
            const deltaTime = now - then;
            then = now;

            for (const obj of objects) {
                if (obj.tick) obj.tick(deltaTime);
            }

            drawScene(gl, programInfo, objects, projectionMatrix);
            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    });
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        border: 1px solid #444;
        display: block;
    }
</style>
