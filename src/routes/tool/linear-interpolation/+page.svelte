<script>
    import { onMount } from "svelte";

    import Chart from "chart.js/auto";

    import katex from "katex";
    import "katex/dist/katex.min.css";

    function asHtmlLatex(latex) {
        return katex.renderToString(latex, {
            throwOnError: false
        });
    }

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

    function sampleData(fx, lower, upper, points) {
        const data = [];
        const interval = (upper-lower)/points;
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
                    showLine: true,
                }, {
                    label: "p_1(x)",
                    data: [],
                    borderColor: "red",
                    backgroundColor: "coral",
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
        let lower = -10;
        let upper = 10;
        let points = 100;
        chart.data.datasets[0].data = [
            { x: x0, y: funcInterpolated(x0) },
            { x: x1, y: funcInterpolated(x1) },
        ];
        chart.data.datasets[1].data = sampleData(func, lower, upper, points);
        chart.data.datasets[2].data = sampleData(funcInterpolated, lower, upper, points);
        chart.options.scales.y.min = 0;
        chart.options.scales.y.max = 200;
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
        For given points {@html asHtmlLatex("x_0")} and {@html asHtmlLatex("x_1")}, with {@html asHtmlLatex("x_0 \\ne x_1")}
        the linear interpolation is {@html asHtmlLatex("p_1(x) = f(x_0) + (\\frac{f(x_1)-f(x_0)}{x_1-x_0}) (x-x_0)")}.
    </div>
</div>

<div class="row">
    <div class="col">
        <h4>Function</h4>
        <div class="d-flex flex-row gap-4">
            {#each functions as e, i}
            <label>
                <input type="radio" value={e} bind:group={selectedFunc} on:change={onChange}/>
                {@html asHtmlLatex(`f(x)=${e.tex}`)}
            </label>
            {/each}
        </div>

        <div class="p-2"/>

        <h4>Interpolation Points</h4>
        <label>
            {@html asHtmlLatex("x_0")}
            <input type="number" class="form-control" placeholder="Starting number" bind:value={x0} on:change={onChange}>
        </label>

        <label>
            {@html asHtmlLatex("x_1")}
            <input type="number" class="form-control" placeholder="Starting number" bind:value={x1} on:change={onChange}>
        </label>
    </div>
</div>

<div class="row">
    <div class="col">
        <canvas bind:this={chartCanvas}/>
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