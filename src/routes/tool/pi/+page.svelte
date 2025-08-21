<script>
    import { katexAsHtml } from "$lib/katexUtility.js";

    import Decimal from 'decimal.js';
    Decimal.set({ precision: 500 });

    let fNextTerm = nextTermNilakanthaSeries;

    // Nilakantha series
    let piEstimate = 3;
    let n = 1;
    let running = false;

    function nextTermNilakanthaSeries() {
        let term = 4 / ((2*n) * (2*n+1) * (2*n+2));
        if (n % 2 === 1) piEstimate += term;
        else piEstimate -= term;
        n++;
    }

    // Chudnovsky algorithm
    let k = 0;
    let sum = new Decimal(0);

    // Factorial function using decimal library for large numbers.
    function factorialDecimal(n) {
        let f = new Decimal(1);
        for (let i = 2; i <= n; i++)
            f = f.times(i);
        return f;
    }

    function nextTermChudnovsky() {
        const numerator = factorialDecimal(6*k).times(545140134*k + 13591409).times(k % 2 === 0 ? 1 : -1);
        const denominator = factorialDecimal(3*k).times(factorialDecimal(k).pow(3)).times(Decimal.pow(640320, 3*k + 1.5));
        const term = new Decimal(12).times(numerator).div(denominator);

        sum = sum.plus(term);
        k++;
        piEstimate = new Decimal(1).div(sum);
    }
    function start() {
        running = true;
        function step() {
            if (!running)
                return;
            fNextTerm();
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function stop() {
        running = false;
    }

    function reset() {
        piEstimate = 3;
        n = 1;
    }
</script>

<svelte:head>
    <title>Pi</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Pi</h1>
    </div>
</div>

<div class="row">
    <h2>Nilakantha series</h2>
    <div class="col-auto">
        <div class="d-flex">
            <span class="text-break">Terms computed: {n-1}</span>
            <button on:click={start}>Start</button>
            <button on:click={stop}>Stop</button>
            <button on:click={fNextTerm}>Next Term</button>
            <button on:click={reset}>Reset</button>
        </div>
    </div>
    <div class="col">
        <span class="text-break">{piEstimate}</span>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Pi" target="_blank">Pi</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Chudnovsky_algorithm" target="_blank">Chudnovsky algorithm</a></li>
        </ul>
    </div>
</div>

<style>
</style>