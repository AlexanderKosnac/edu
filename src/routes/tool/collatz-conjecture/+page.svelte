<script>

function collatz(n) {
    return (n % 2 == 0) ? n/2 : 3*n+1;
}

async function calculateCollatz() {
    console.log(run)
    const start = parseInt(document.querySelector("#start").value);
    let n = start;
    let time = 0;
    let sequence = [n];
    if (n < 1) return;
    while (n != 1) {
        time++;
        n = collatz(n);
        sequence.push(n);
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
            <button type="button" class="btn btn-primary" on:click={calculateCollatz}>Run</button>
            <input id="start" type="number" class="form-control" placeholder="Starting number" value="1024">
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
</style>