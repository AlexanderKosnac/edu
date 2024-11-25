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

    function onChange() {
        plotInterpolation(x => x**2, -10, 10, 5);
    }

    function sampleData(f, lower, upper, points) {
        const data = [];
        const interval = (upper-lower)/points;
        for (let x = lower; x <= upper; x += interval) {
            data.push({ x: x, y: f(x) });
        }
        return data;
    }

    function plotInterpolation(fx, lower, upper, points) {
        const ctx = chartCanvas.getContext("2d");
        new Chart(ctx, {
            type: "scatter",
            data: {
                datasets: [{
                    label: "Interpolation",
                    data: sampleData(fx, lower, upper, points),
                    borderColor: "blue",
                    backgroundColor: "lightblue",
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

    onMount(()=> {
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
        For points {@html asHtmlLatex("x_0")} and {@html asHtmlLatex("x_1")}, with {@html asHtmlLatex("x_0 \\ne x_1")}.

        {@html asHtmlLatex("p_1(x) = f(x_0) + (\\frac{f(x_1)-f(x_0)}{x_1-x_0}) (x-x_0)")}
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