<script>
import { onMount } from "svelte";
import Chart from "chart.js/auto";

let chart;
const data = {
    labels: [],
    datasets: [{
        label: "Iteration",
        data: [],
        backgroundColor: "#0d6efd",
        borderWidth: 2,
        borderColor: "#0d6efd",
    }]
};

onMount(()=> {
    const ctx = document.querySelector("#iteration-values-chart").getContext('2d');
    chart = new Chart(ctx, {
        type: "line",
        data: data,
        options: {
            maintainAspectRatio: false,
            animation: {
                duration: 0
            }
        }
    });
})

let iterationHook = (iteration, value) => {
    chart.data.labels.push(iteration);
    chart.data.datasets[0].data.push(value);
    chart.update();
};

function collatz(n) {
    return (n % 2 == 0) ? n/2 : 3*n+1;
}

async function runCollatz() {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.update();

    const start = parseInt(document.querySelector("#start").value);
    let n = start;
    let time = 0;
    let sequence = [n];
    if (n < 1) return;
    iterationHook(time, n);
    while (n != 1) {
        time++;
        n = collatz(n);
        sequence.push(n);
        iterationHook(time, n);
    }
    run = {
        start: start,
        time: time,
        sequence: sequence,
    }
}

let run = {
    start: 0,
    time: 0,
    sequence: [],
};
</script>

<div class="row">
    <div class="col">
        <h1>Collatz conjecture</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="input-group mb-2">
            <button type="button" class="btn btn-primary" on:click={runCollatz}>Run</button>
            <input id="start" type="number" class="form-control" placeholder="Starting number" value="27">
        </div>

        <table class="table table-bordered">
            <tbody>
                <tr>
                    <th>Start Value</th>
                    <td>{run.start}</td>
                </tr>
                <tr>
                    <th>Iterations</th>
                    <td>{run.time}</td>
                </tr>
                <tr>
                    <th>History</th>
                    <td>{run.sequence.join(", ")}</td>
                </tr>
            </tbody>
        </table>

        <div class="chart-container">
            <canvas id="iteration-values-chart" height={400} />
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Collatz_conjecture" target="_blank">Collatz conjecture</a></li>
        </ul>
    </div>
</div>

<style>
th {
    white-space: nowrap;
}
td {
    width: 100%;
}
.chart-container {
    max-height: 400px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-content: center;
}
</style>