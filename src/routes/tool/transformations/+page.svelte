<script>
	import { onMount } from "svelte";
    import Matrix from "./Matrix.svelte";
    import { matMult } from "./math";
    import { transformations } from "./transformations";

    let canvas;
    let canvas_dimensions = [1000, 1000];

    let inputMatrix;

    let ctx;

    let activeTransformation = transformations[0];

    let shape = [
        [[160], [160]],
        [[320], [240]],
        [[240], [320]],
        [[ 80], [320]],
        [[  0], [240]],
        [[  0], [ 80]],
        [[ 80], [  0]],
        [[240], [  0]],
        [[320], [ 80]],
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
        return arr.flat(Infinity).every(i => !isNaN(i));
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function render() {
        clearCanvas();
        drawShape(shape, [0, 0, 255, 1.0]);
        drawShape(getTransformedShape(activeTransformation.isAffine), [255, 0, 0, 0.5]);

        ctx.lineWidth = 5;
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

    onMount(async () => {
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
        <div class="d-flex gap-3 mb-3">
            {#each transformations as transformation, idx}
            <label class="form-check-label">
                <input type="radio" class="form-check-input" name="transformation" autocomplete="off"
                    bind:group={activeTransformation} value={transformation} on:change={onMatrixChange}>
                {transformation.name}
            </label>
            {/each}
        </div>

        <h3>{activeTransformation.name}</h3>
        <div class="d-flex align-items-center gap-2">
            <Matrix bind:this={inputMatrix} inputs={activeTransformation.inputs} editable={activeTransformation.editable} on:change={onMatrixChange}/>
            <span class="symbol">*</span>
            <Matrix inputs={activeTransformation.point}/>
            <span class="symbol">=</span>
            <Matrix inputs={activeTransformation.getResult()}/>
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
        image-rendering: -webkit-optimize-contrast; /* webkit */
        image-rendering: -moz-crisp-edges; /* Firefox */
        height: 500px;
        width: 500px;
    }
</style>