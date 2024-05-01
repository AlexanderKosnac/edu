<script>
import IterationValueChart from "./IterationValueChart.svelte";

let startInput;
let iterationValueChart;

function collatz(n) {
    return (n % 2 == 0) ? n/2 : 3*n+1;
}

function runCollatz(start, iterationHook = (it, n) => {}) {
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

function sampleRunCollatz(e) {
    startInput.value = e.target.innerText;
    singleCollatzRun();
}

function singleCollatzRun() {
    const start = parseInt(startInput.value);
    iterationValueChart.clearData();
    runCollatz(start, (it, n) => {
        iterationValueChart.addDatapoint(it, n);
    });
}

</script>

<div class="row">
    <div class="col">
        <h1>Collatz conjecture</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="input-group mb-2">
            <button type="button" class="btn btn-primary" on:click={singleCollatzRun}>Run</button>
            <input bind:this={startInput} type="number" class="form-control" placeholder="Starting number" value="1024">
        </div>

        <div class="d-flex align-items-center gap-1 mb-2">
            <div>Interesting starting points:</div>
            <button type="button" class="btn btn-sm btn-outline-primary" on:click={sampleRunCollatz}>15</button>
            <button type="button" class="btn btn-sm btn-outline-primary" on:click={sampleRunCollatz}>27</button>
            <button type="button" class="btn btn-sm btn-outline-primary" on:click={sampleRunCollatz}>1024</button>
            <button type="button" class="btn btn-sm btn-outline-primary" on:click={sampleRunCollatz}>9663</button>
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
            <IterationValueChart bind:this={iterationValueChart}/>
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