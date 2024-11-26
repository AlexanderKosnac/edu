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

    let func = x => x**2
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

    function createGraph() {
        const ctx = chartCanvas.getContext("2d");
        chart = new Chart(ctx, {
            type: "scatter",
            data: {
                datasets: [{
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
        let points = 10;
        chart.data.datasets[0].data = sampleData(func, lower, upper, points);
        chart.data.datasets[1].data = sampleData(funcInterpolated, lower, upper, points);
        chart.update();
    }

    onMount(()=> {
        createGraph();
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