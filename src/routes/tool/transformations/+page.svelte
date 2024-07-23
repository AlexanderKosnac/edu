<script>
	import { onMount } from "svelte";
    import Matrix from "./Matrix.svelte";
    import { matMult } from "./math";

    let canvas;
    let canvas_dimensions = [1000, 1000];

    const POINT = [["x"], ["y"]];

    let transformations = [
        {
            name: "Scaling",
            matrix: [["s", 0], [0, "t"]],
            editable: [[true, false] ,[false, true]],
            getResult: function() {
                return [[`${this.matrix[0][0]}*x`], [`${this.matrix[1][1]}*y`]];
            },
        }, {
            name: "Shear X",
            matrix: [[1, "s"], [0, 1]],
            editable: [[false, true] ,[false, false]],
            getResult: function() {
                return [[`x+${this.matrix[0][1]}*y`], [`y`]];
            },
        }, {
            name: "Shear Y",
            matrix: [[1, 0], ["s", 1]],
            editable: [[false, false] ,[true, false]],
            getResult: function() {
                return [[`x`], [`${this.matrix[1][0]}*x+y`]];
            },
        },
    ];
    let activeTransformation = transformations[2];

    let ctx;

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

    function parseMatrixArray(arr) {
        return arr.map(col => col.map(e => parseFloat(e)));
    }

    function getTransformedShape() {
        const m = parseMatrixArray(activeTransformation.matrix);
        if (!validMatrix(m)) return shape;
        return shape.map(p => matMult(m, p));
    }

    function drawShape(points, color) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color.join(",")})`;
        ctx.moveTo(points[0][0], points[0][1]);
        points.forEach(point => ctx.lineTo(point[0], point[1]));
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
        drawShape(getTransformedShape(), [255, 0, 0, 0.5]);

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
        render();
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
        <h4>{activeTransformation.name}</h4>
        <div class="d-flex align-items-center gap-2">
            <Matrix bind:this={inputMatrix} inputs={activeTransformation.inputs} editable={activeTransformation.editable} on:change={onMatrixChange}/>
            <span class="symbol">*</span>
            <Matrix matrix={POINT}/>
            <span class="symbol">=</span>
            <Matrix matrix={activeTransformation.getResult()}/>
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