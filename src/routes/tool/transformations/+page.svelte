<script>
	import { onMount } from "svelte";
    import Matrix from "./Matrix.svelte";
    import { matMult } from "./math.js";

    let canvas;

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

    let shape = [
        [[20], [20]],
        [[36], [28]],
        [[28], [36]],
        [[12], [36]],
        [[ 4], [28]],
        [[ 4], [12]],
        [[12], [ 4]],
        [[28], [ 4]],
        [[36], [12]],
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
        const ctx = canvas.getContext("2d");
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
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function render() {
        clearCanvas();
        drawShape(shape, [0, 0, 255, 1.0]);
        drawShape(getTransformedShape(), [255, 0, 0, 0.5]);
    }

    function onMatrixChange() {
        render();
        activeTransformation = activeTransformation;
    }

    onMount(async () => {
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
            <Matrix matrix={activeTransformation.matrix} editable={activeTransformation.editable} on:change={onMatrixChange}/>
            <span class="symbol">*</span>
            <Matrix matrix={POINT}/>
            <span class="symbol">=</span>
            <Matrix matrix={activeTransformation.getResult()}/>
        </div>
    </div>
    <div class="col">
        <canvas bind:this={canvas} width="100" height="100" class="border visualization"></canvas>
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