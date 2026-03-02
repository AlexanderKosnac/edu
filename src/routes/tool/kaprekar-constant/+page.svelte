<script>
    const KAPREKAR_CONSTANT = 6174;

    let number = 8991;

    let kapIters = null;
    let history = [];
    let error = null;

    const kaprekarRoutineWithHistory = (number) => kaprekarRoutine(number, (a, b, c) => history.push(`${a} - ${b} = ${c}`));

    $: {
        try {
            history = [];
            kapIters = kaprekarRoutineWithHistory(number);
            error = null;
        } catch (err) {
            kapIters = null;
            error = err.message;
        }
    }

    const massAnalysis = {};

    function runMassAnalysis() {
        const errorCategorizer = (_, str) => {
            if (str.startsWith("Loop detected")) return "looping";
            if (str.startsWith("Exceeded maximum iterations")) return "timeout";
            return "unknown";
        };

        for (let i = 1000; i <= 9999; i++) {
            let k = kaprekarRoutineOrFallback(i, errorCategorizer);

            if (!massAnalysis[k]) massAnalysis[k] = [];
            massAnalysis[k].push(i);
        }
    }

    function kaprekarRoutineOrFallback(number, fallback) {
        try {
            return kaprekarRoutine(number);
        } catch (err) {
            return fallback(number, err);
        }
    }

    function kaprekarRoutine(number, onIteration = (_a, _b, _c) => {}) {
        if (!number || number < 1000 || number > 9999) return;

        let visited = [];
        let i = 0;

        let n = number;
        while (n != KAPREKAR_CONSTANT) {
            const k = kaprekarStep(n);
            onIteration(k[0], k[1], k[2]);

            n = k[2];

            if (visited.includes(n)) throw `Loop detected for ${number} in iteration ${i} with value ${n}.`;
            if (i++ > 50) throw "Exceeded maximum iterations.";

            visited.push(n);
        }

        return i;
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
            <button type="button" class="btn btn-primary" disabled={!number} onclick={() => kaprekarRoutineWithHistory(number)}>Run</button>
            <input type="number" class="form-control" min="1000" max="9999" bind:value={number} placeholder="Number to evaluate" />
        </div>

        {#if error}
            (<span class="text-danger">{error}</span>)
        {:else}
            <div>
                {number} is a {kapIters}-Kaprekar number.
            </div>

            <div class="mt-4">
                <h4>Calculations:</h4>
                <pre>{#each history as step, i}#{i + 1}:  {step}<br />{/each}</pre>
            </div>
        {/if}
    </div>
</div>

<div class="row">
    <div class="col">
        <button type="button" class="btn btn-primary" disabled={!number} onclick={runMassAnalysis}>Calculate Statistics</button>

        <ul>
            {#each Object.entries(massAnalysis) as [k, e]}
                <li>{k} = {e.length}</li>
            {/each}
        </ul>
    </div>
</div>

<style>
</style>
