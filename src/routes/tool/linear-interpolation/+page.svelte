<script>
    import { onMount } from "svelte";

    import Chart from "chart.js/auto";

    import { katexAsHtml } from "$lib/katexUtility.js";

    let chartCanvas;
    let chart;

    let x0 = -5;
    let x1 = 5;

    let functions = [
        {
            fx: x => 0.5 * x + 2,
            tex: "\\frac{1}{2} x + 2",
        }, {
            fx: x => x**2,
            tex: "x^2",
        }, {
            fx: x => 0.25 * (x**3 + 3*x**2 - 6*x - 8),
            tex: "\\frac{1}{4} (x^3 + 3x^2 - 6x - 8)",
        }, {
            fx: x => 2 * x**4 - 3 * x**3 + 5 * x**2 - x + 7,
            tex: "2x^4 - 3x^3 + 5x^2 - x + 7",
        },
    ];

    let selectedFunc = functions[1];

    $: func = selectedFunc.fx;
    $: funcInterpolated = getInterpolatedFxFunction(func, x0, x1);

    function onChange() {
        updateData();
    }

    function getInterpolatedFxFunction(fx, x0, x1) {
        return x => fx(x0) + (fx(x1)-fx(x0))/(x1-x0) * (x-x0);
    }

    function sampleData(fx, lower, upper, nPoints) {
        const data = [];
        const interval = (upper-lower)/nPoints;
        for (let x = lower; x <= upper; x += interval) {
            data.push({ x: x, y: fx(x) });
        }
        return data;
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
                }, {
                    label: "p_1(x)",
                    data: [],
                    borderColor: "red",
                    backgroundColor: "coral",
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
        let lower = x0;
        let upper = x1;
        let nSamplePoints = 10*(upper-lower);
        chart.data.datasets[0].data = [
            { x: x0, y: funcInterpolated(x0) },
            { x: x1, y: funcInterpolated(x1) },
        ];
        chart.data.datasets[1].data = sampleData(func, lower, upper, nSamplePoints);
        chart.data.datasets[2].data = sampleData(funcInterpolated, lower, upper, nSamplePoints);
        chart.update();
    }

    onMount(()=> {
        initGraph();
        onChange();
    });
</script>

<svelte:head>
    <title>Linear Interpolation</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Linear Interpolation</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        For given points {@html katexAsHtml("x_0")} and {@html katexAsHtml("x_1")}, with {@html katexAsHtml("x_0 \\ne x_1")}
        the linear interpolation is {@html katexAsHtml("p_1(x) = f(x_0) + (\\frac{f(x_1)-f(x_0)}{x_1-x_0}) (x-x_0)")}.
    </div>
</div>

<div class="row">
    <div class="col-8">
        <canvas bind:this={chartCanvas}></canvas>
    </div>

    <div class="col-4">
        <h4>Interpolation Points</h4>
        <label>
            {@html katexAsHtml("x_0")}
            <input type="number" class="form-control" placeholder="Starting number" bind:value={x0} on:change={onChange}>
        </label>

        <label>
            {@html katexAsHtml("x_1")}
            <input type="number" class="form-control" placeholder="Starting number" bind:value={x1} on:change={onChange}>
        </label>

        {#if x0 == x1}
        <div class="text-danger">{@html katexAsHtml("x_0")} can not be equal to {@html katexAsHtml("x_1")}.</div>
        {/if}

        <div class="p-2"></div>

        <h4>Function</h4>
        <div class="d-flex flex-column gap-3">
            {#each functions as e}
            <label>
                <input type="radio" value={e} bind:group={selectedFunc} on:change={onChange}/>
                {@html katexAsHtml(`f(x)=${e.tex}`)}
            </label>
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/" target="_blank">None</a></li>
        </ul>
    </div>
</div>

<style>
</style>