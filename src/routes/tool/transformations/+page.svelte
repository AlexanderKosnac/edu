<script>
	import { onMount } from "svelte";
    import { matMult } from "$lib/math";
    import Matrix from "$lib/Matrix/Matrix.svelte";
    import { transformations } from "./transformations";

    let canvas;

    let inputMatrix;
    let canvas_dimensions = [600, 600];

    let ctx;

    let activeTransformation = transformations[0];

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

    function getTransformedShape(isAffine) {
        const m = inputMatrix.getEvalMatrix();
        if (!validMatrix(m)) return shape;
        return shape.map(p => isAffine ? [...p, [1]] : p).map(p => matMult(m, p));
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
        drawShape(getTransformedShape(activeTransformation.isAffine), [255, 0, 0, 0.5]);

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
        activeTransformation = activeTransformation;
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
            <label for="transformationSelection">Transformation:</label>
            <select class="form-select" id="transformationSelection" bind:value={activeTransformation} on:change={onMatrixChange}>
                {#each transformations as transformation}
                    <option value={transformation}>{transformation.name}</option>
                {/each}
            </select>

            <div class="d-flex align-items-center gap-2">
                <Matrix bind:this={inputMatrix} inputs={activeTransformation.inputs} on:change={onMatrixChange}/>
                <span class="symbol">*</span>
                <Matrix inputs={activeTransformation.point}/>
                <span class="symbol">=</span>
                <Matrix inputs={activeTransformation.getResult()}/>
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
    .symbol {
        font-weight: 600;
        font-size: 1.5em;
    }
    .visualization {
        height: 600px;
        width: 600px;
    }
</style>