<script>
    let number = 8991;
    $: if (number < 1) {
        number = 1;
    }

    let run;

    function runRoutine() {
        let covered = [];
        let i = 0;
        let err;

        let history = [];
        let n = number;
        while (n != 6174) {
            const k = kaprekanStep(n);
            n = k[2];
            history.push(`${k[0]} - ${k[1]} = ${k[2]}`);

            if (covered.includes(n)) {
                err = "Loop detected. Canceled."
                break;
            } else {
                covered.push(n);
            }

            if (i++ > 1000) {
                err = "Over 1000 iterations. Canceled.";
                break;
            }
        }

        run = {
            number: number,
            p: i,
            history: history,
            err: err,
        }
    }

    function kaprekanStep(n) {
        let a = `${n}`.split("").sort((a, b) => a < b).join("");
        let b = `${n}`.split("").sort((a, b) => b < a).join("");
        let c = `${a - b}`.padEnd(`${n}`.length, "0");
        return [a, b, c];
    }

    runRoutine();
</script>

<svelte:head>
    <title>Kaprekar constant</title> 
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Kaprekar constant</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="input-group mb-2">
            <button type="button" class="btn btn-primary" disabled="{!number}" on:click={runRoutine}>Run</button>
            <input type="number" class="form-control" min="1" bind:value={number} placeholder="Number to evaluate">
        </div>
    </div>

    {#if run}
    <div>
        {run.number} is a {run.p}-Kaprekar number. 

        {#if run.err}
        (<span class="text-danger">{run.err}</span>)
        {/if}
    </div>

    <div class="mt-4">
        <h4>Calculations:</h4>
        <pre>{#each run.history as step, i}#{i}:  {step}<br>{/each}</pre>
    </div>
    {/if}
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Kaprekar%27s_routine" target="_blank">Kaprekar's routine</a></li>
            <li><a href="https://en.wikipedia.org/wiki/6174" target="_blank">6174</a></li>
        </ul>
    </div>
</div>

<style>
</style>