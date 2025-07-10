<script>
	import { onMount } from "svelte";
    import { matMult } from "$lib/math";

    import { katexAsHtml, toKatexVector, toKatexMatrix } from "$lib/katexUtility.js";

    import { transformations } from "./transformations";

    let canvas;
    let canvas_dimensions = [600, 600];

    let ctx;

    let selectedIdx = 1;
    $: activeTransformation = transformations[selectedIdx];

    let shape = [
        [[80], [80]],
        [[160], [120]],
        [[120], [160]],
        [[ 40], [160]],
        [[  0], [120]],
        [[  0], [ 40]],
        [[ 40], [  0]],
        [[120], [  0]],
        [[160], [ 40]],
    ]

    function getTransformedShape(transformation) {
        const m = transformation.getMatrix();
        if (!validMatrix(m))
            return shape;
        return shape
            .map(p => transformation.isAffine ? [...p, [1]] : p)
            .map(p => matMult(m, p));
    }

    function drawShape(points, color) {
        let offset = canvas_dimensions.map(i => i/2);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color.join(",")})`;
        ctx.moveTo(points[0][0][0]+offset[0], points[0][1][0]+offset[1]);
        points.forEach(point => ctx.lineTo(point[0][0]+offset[0], point[1][0]+offset[1]));
        ctx.fill();
    }

    function validMatrix(arr) {
        return arr.flat(Infinity).every(i => isFinite(i));
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function render() {
        clearCanvas();

        drawShape(shape, [0, 0, 255, 1.0]);
        drawShape(getTransformedShape(activeTransformation), [255, 0, 0, 0.5]);

        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(128, 128, 128, 1.0)`;

        // Axes
        ctx.beginPath();
        ctx.moveTo(0, canvas_dimensions[1]/2);
        ctx.lineTo(canvas_dimensions[0], canvas_dimensions[1]/2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvas_dimensions[0]/2, 0);
        ctx.lineTo(canvas_dimensions[0]/2, canvas_dimensions[1]);
        ctx.stroke();
    }

    function onMatrixChange() {
        render();
    }

    onMount(() => {
        ctx = canvas.getContext("2d");
        onMatrixChange();
	});
</script>

<svelte:head>
    <title>Transformations</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Transformations</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>Basic 2D</h2>
        <div class="d-flex flex-column gap-1">
            <div class="d-flex gap-1 align-items-center">
                <label for="transformationSelection">Transformation:</label>
                <select class="form-select" id="transformationSelection" bind:value={selectedIdx} on:change={onMatrixChange}>
                    {#each transformations as transformation, i}
                        <option value={i}>{transformation.name}</option>
                    {/each}
                </select>
            </div>

            <div class="d-flex gap-1 align-items-center">
                <div class="d-flex gap-1 align-items-center">
                    {#each Object.entries(transformations[selectedIdx].inputs) as [key, _]}
                        <label>                            
                            {key}:
                            <input type="number" class="form-control matrix-input"
                                step="0.1"
                                bind:value={transformations[selectedIdx].inputs[key]}
                                on:change={onMatrixChange}/>
                        </label>
                    {/each}
                </div>
            </div>

            <div class="d-flex align-items-center gap-2">
                {@html katexAsHtml(
                    toKatexMatrix(activeTransformation.base) +
                    toKatexVector([["x"], ["y"]]) +
                    "=" +
                    toKatexMatrix(activeTransformation.getMatrix()) +
                    toKatexVector([["x"], ["y"]]) +
                    "=" +
                    toKatexVector(activeTransformation.getResult())
                )}
            </div>
        </div>
    </div>
    <div class="col">
        <canvas bind:this={canvas} width="{canvas_dimensions[0]}" height="{canvas_dimensions[1]}" class="border visualization"></canvas>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li>Missing</li>
        </ul>
    </div>
</div>

<style>
    .matrix-input {
        width: 8em;
    }
    .visualization {
        height: 600px;
        width: 600px;
    }
</style>