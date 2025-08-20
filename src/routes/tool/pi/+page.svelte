<script>
    import { katexAsHtml } from "$lib/katexUtility.js";

    let piEstimate = 3;
    let n = 1;
    let running = false;

    function nextTerm() {
        let term = 4 / ((2*n) * (2*n+1) * (2*n+2));
        if (n % 2 === 1) piEstimate += term;
        else piEstimate -= term;
        n++;
    }

    function start() {
        running = true;
        function step() {
            if (!running)
                return;
            nextTerm();
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
    <div class="col">
        <p>{piEstimate}</p>
        <p>Terms computed: {n-1}</p>
        <button on:click={start}>Start</button>
        <button on:click={stop}>Stop</button>
        <button on:click={nextTerm}>Next Term</button>
        <button on:click={reset}>Reset</button>
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