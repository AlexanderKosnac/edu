<script>
    import { onMount } from "svelte";

    import Chart from "chart.js/auto";
    import { matrix, multiply, inv } from "mathjs";

    import katex from "katex";
    import "katex/dist/katex.min.css";

    import { sampleFunction, polynomial } from "$lib/math.js";
    import { toKatexVector, toKatexMatrix } from "$lib/katexUtility.js";

    function asHtmlLatex(latex) {
        return katex.renderToString(latex, {
            throwOnError: false
        });
    }

    function getVandermondeMatrix(x) {
        return matrix(x.map(xi => {
            return Array.from({ length: x.length }, (_, j) => Math.pow(xi, j));
        }));
    }

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    }

    function hasDuplicates(array) {
        return new Set(array).size !== array.length;
    }

    const randY = () => getRandomInt(-10, 10);

    let inputX, inputY;
    let points = [
        { x: -10, y: randY() },
        { x:  -4, y: randY() },
        { x:   0, y: randY() },
        { x:   6, y: randY() },
        { x:  10, y: randY() },
    ];

    function addPoint() {
        if (inputX.length == 0 || inputY.length == 0) return;
        points.push({ x: inputX, y: inputY });
        points = [...points];
        onChange();
    }

    function removePoint(i) {
        points.splice(i, 1);
        points = [...points];
        onChange();
    }

    let chartCanvas;
    let chart;

    function onChange() {
        updateData();
    }

    const xi = i => points[i].x;
    const yi = i => points[i].y;
    const xAll = () => [...points.map(p => p.x)];
    const yAll = () => [...points.map(p => p.y)];
    const minXi = () => Math.min(...xAll());
    const maxXi = () => Math.max(...xAll());

    let coefficients = [];

    function updateCoefficients() {
        coefficients = multiply(inv(getVandermondeMatrix(xAll())), yAll()).toArray();
    }

    function interpolationLatex() {
        const vandermonde = getVandermondeMatrix(xAll());
        const yVec = matrix(yAll());
        let resultVec = [];
        try {
            resultVec = multiply(inv(vandermonde), yVec);
        } catch (error) {
            return `\\text{${error}}`
        }
        return `${toKatexMatrix(vandermonde)}^{-1} \\cdot{} ${toKatexVector(yVec)} = ${toKatexVector(resultVec)}`;
    }

    function interpolationPolynomial(x) {
        return polynomial(x, coefficients);
    }

    function initGraph() {
        const ctx = chartCanvas.getContext("2d");
        chart = new Chart(ctx, {
            type: "scatter",
            data: {
                datasets: [{
                    label: "interpolation points",
                    data: [],
                    borderColor: "gray",
                    backgroundColor: "lightgray",
                    pointRadius: 6,
                }, {
                    label: "f(x)",
                    data: [],
                    borderColor: "blue",
                    backgroundColor: "lightblue",
                    pointRadius: 0,
                    showLine: true,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                    }
                },
                animation: {
                    duration: 0
                },
                scales: {
                    x: {
                        type: "linear",
                        position: "bottom",
                        title: {
                            display: true,
                            text: "x"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "y"
                        }
                    }
                }
            }
        });
    }

    function updateData() {
        try {
            updateCoefficients();
        } catch (error) {
            return;
        }
        let lower = minXi();
        let upper = maxXi();
        let nSamplePoints = 10 * (upper - lower);
        chart.data.datasets[0].data = points;
        chart.data.datasets[1].data = sampleFunction(interpolationPolynomial, lower, upper, nSamplePoints);
        chart.update();
    }

    onMount(()=> {
        initGraph();
        onChange();
    });
</script>

<svelte:head>
    <title>Vandermonde Polynomial Interpolation</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Vandermonde Polynomial Interpolation</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <canvas bind:this={chartCanvas}></canvas>
    </div>
    <div class="col-auto" style="width: 400px">
        <h4>Interpolation Points</h4>
        <table class="table w-auto">
        <thead>
            <tr>
                <th scope="col">{@html asHtmlLatex("i")}</th>
                <th scope="col">{@html asHtmlLatex("x_i")}</th>
                <th scope="col">{@html asHtmlLatex("y_i")}</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            {#each points as _, i}
            <tr>
                <td>{@html asHtmlLatex(`${i}`)}</td>
                <td><input type="number" class="form-control point-input" placeholder="x" bind:value={points[i].x} on:change={onChange}></td>
                <td><input type="number" class="form-control point-input" placeholder="y" bind:value={points[i].y} on:change={onChange}></td>
                <td><button type="button" class="btn btn-secondary" on:click={() => removePoint(i)}>Remove</button></td>
            </tr>
            {/each}
            <tr>
                <td>{@html asHtmlLatex("i")}</td>
                <td><input type="number" class="form-control point-input" placeholder="x" bind:value={inputX}></td>
                <td><input type="number" class="form-control point-input" placeholder="y" bind:value={inputY}></td>
                <td><button type="button" class="btn btn-primary" on:click={addPoint}>Add</button></td>
            </tr>
        </tbody>
        </table>

        {#if hasDuplicates(points.map(p => p.x))}
        <div class="text-danger">{@html asHtmlLatex("x_0")} can not be equal to {@html asHtmlLatex("x_1")}.</div>
        {/if}

        <button type="button" class="btn btn-primary" on:click={updateData}>Refresh</button>
    </div>
</div>

<div class="row mb-5">
    <div class="col text-center">
        {@html asHtmlLatex(interpolationLatex())}
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Vandermonde_matrix" target="_blank">Vandermonde matrix</a></li>
        </ul>
    </div>
</div>

<style>
    .point-input {
        width: 100px;
    }
</style>