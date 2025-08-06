<script>
    import { onMount } from "svelte";

    import Chart from "chart.js/auto";

    import { katexAsHtml, katexAsHtmlInline } from "$lib/katexUtility.js";
    import { sampleFunction } from "$lib/math.js";

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
    const minXi = () => Math.min(...points.map(p => p.x));
    const maxXi = () => Math.max(...points.map(p => p.x));

    function basisFunction(i, x) {
        let n = points.length;
        let prod = 1;
        for (let j=0; j<n; j++) {
            if (j == i) continue;
            prod *= (x - xi(j))/(xi(i) - xi(j));
        }
        return prod;
    }

    function interpolationPolynomial(x) {
        let n = points.length;
        let sum = 0;
        for (let i=0; i<n; i++) {
            sum += yi(i)*basisFunction(i, x);
        }
        return sum;
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
        let lower = minXi();
        let upper = maxXi();
        let nSamplePoints = 10*(upper-lower);
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
    <title>Lagrange Polynomial Interpolation</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Lagrange Polynomial Interpolation</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        The goal of Lagrange interpolation is to find the polynomial {@html katexAsHtmlInline("p \\in P_n")} for
        {@html katexAsHtmlInline("n+1")} interpolation points {@html katexAsHtmlInline("x_0, \\dots, x_n \\in \\R")} and
        associated values {@html katexAsHtmlInline("y_0, \\dots, y_n \\in \\R")} so that:
        {@html katexAsHtmlInline("p(x_i) = y_i \\quad{} \\text{for } i=0, \\dots , n")}.
        For the constuction, Lagrange basis functions are used:
        {@html katexAsHtmlInline("L^{(n)}_i(x) := \\prod_{\\substack{j=0, j \\neq i}}^n \\frac{x - x_j}{x_i - x_j} \\in P_n, i = 0, \\dots{} n")}.
        With this the interpolation polynomial can be constructed:
        {@html katexAsHtmlInline("p := \\sum^{n}_{i=0} y_i L^{(n)}_i \\in P_n")}.
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
                <th scope="col">{@html katexAsHtmlInline("i")}</th>
                <th scope="col">{@html katexAsHtmlInline("x_i")}</th>
                <th scope="col">{@html katexAsHtmlInline("y_i")}</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            {#each points as _, i}
            <tr>
                <td>{@html katexAsHtmlInline(`${i}`)}</td>
                <td><input type="number" class="form-control point-input" placeholder="x" bind:value={points[i].x} on:change={onChange}></td>
                <td><input type="number" class="form-control point-input" placeholder="y" bind:value={points[i].y} on:change={onChange}></td>
                <td><button type="button" class="btn btn-secondary" on:click={() => removePoint(i)}>Remove</button></td>
            </tr>
            {/each}
            <tr>
                <td>{@html katexAsHtmlInline("i")}</td>
                <td><input type="number" class="form-control point-input" placeholder="x" bind:value={inputX}></td>
                <td><input type="number" class="form-control point-input" placeholder="y" bind:value={inputY}></td>
                <td><button type="button" class="btn btn-primary" on:click={addPoint}>Add</button></td>
            </tr>
        </tbody>
        </table>

        {#if hasDuplicates(points.map(p => p.x))}
        <div class="text-danger">{@html katexAsHtmlInline("x_0")} can not be equal to {@html katexAsHtmlInline("x_1")}.</div>
        {/if}

        <button type="button" class="btn btn-primary" on:click={updateData}>Refresh</button>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Lagrange_polynomial" target="_blank">Lagrange polynomial</a></li>
        </ul>
    </div>
</div>

<style>
    .point-input {
        width: 100px;
    }
</style>