<script>
    const KAPREKAR_CONSTANT = 6174;

    let number = 8991;

    $: run = runRoutine(number);

    function runRoutine(number) {
        if (!number)
            return;

        let visited = [];
        let i = 0;
        let err;

        let history = [];
        let n = number;
        while (n != KAPREKAR_CONSTANT) {
            const k = kaprekarStep(n);
            n = k[2];
            history.push(`${k[0]} - ${k[1]} = ${k[2]}`);

            if (visited.includes(n)) {
                err = "Loop detected. Canceled.";
                break;
            } else {
                visited.push(n);
            }

            if (i++ > 1000) {
                err = "Over 1000 iterations. Canceled.";
                break;
            }
        }

        return {
            number: number,
            p: i,
            history: history,
            err: err,
        };
    }

    function kaprekarStep(n) {
        let a = `${n}`
            .split("")
            .sort((a, b) => a < b)
            .join("");
        let b = `${n}`
            .split("")
            .sort((a, b) => b < a)
            .join("");
        let c = `${a - b}`.padEnd(`${n}`.length, "0");
        return [a, b, c];
    }
</script>

<div class="row">
    <div class="col">
        <div class="input-group mb-2">
            <button type="button" class="btn btn-primary" disabled={!number} onclick={runRoutine}>Run</button>
            <input type="number" class="form-control" min="1" bind:value={number} placeholder="Number to evaluate" />
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
            <pre>{#each run.history as step, i}#{i}:  {step}<br />{/each}</pre>
        </div>
    {/if}
</div>

<style>
</style>
