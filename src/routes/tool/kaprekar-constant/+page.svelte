<script>
    import SvgPieChart from "$lib/SvgPieChart/SvgPieChart.svelte";

    import { getEvenlySpacedColorsHex, getEvenlySpacedColorsHsl } from "$lib/colorUtility";

    const KAPREKAR_CONSTANT = 6174;

    let number = 8991;

    let kapIters = null;
    let history = [];
    let error = null;

    let itersDistrChart = [];
    let selectedSlice;

    const onSliceSelected = (slice) => (selectedSlice = slice);

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

    let massAnalysis;

    function runMassAnalysis() {
        const errorCategorizer = (_, str) => {
            if (str.startsWith("Loop detected")) return "looping";
            if (str.startsWith("Exceeded maximum iterations")) return "timeout";
            return "unknown";
        };

        massAnalysis = {};

        for (let i = 1000; i <= 9999; i++) {
            let k = kaprekarRoutineOrFallback(i, errorCategorizer);

            if (!massAnalysis[k]) massAnalysis[k] = [];
            massAnalysis[k].push(i);
        }

        itersDistrChart = [];
        const colors = getEvenlySpacedColorsHsl(7, 80, 60);

        let i = 0;
        for (let key in massAnalysis) {
            if (key === "0" || key === "looping" || key === "timeout") continue;
            itersDistrChart.push({ label: key, value: massAnalysis[key].length, color: colors[i % colors.length] });
            i++;
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

    runMassAnalysis();
</script>

<div class="row">
    <div class="col">
        <div class="input-group mb-2">
            <button type="button" class="btn btn-primary" disabled={!number} onclick={() => kaprekarRoutineWithHistory(number)}>Run</button>
            <input type="number" class="form-control" min="1000" max="9999" bind:value={number} placeholder="Number to evaluate" />
        </div>
    </div>
</div>

<div class="row">
    <div class="col-auto">
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
    <div class="col">
        {#if massAnalysis}
            <div class="d-flex flex-row gap-1">
                <div>
                    <SvgPieChart data={itersDistrChart} radius={200} onClick={onSliceSelected} onMouseover={onSliceSelected} />
                </div>
                <div>
                    <table class="table table-bordered w-auto mt-1">
                        <thead>
                            <tr>
                                <th>Iterations</th>
                                <th>Amount of numbers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each Object.entries(massAnalysis) as [k, e]}
                                <tr class:highlighted={k === selectedSlice?.label}>
                                    <td>{k}</td>
                                    <td>{e.length}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    tr.highlighted > td {
        background-color: var(--bs-primary);
    }
</style>
