<script>
    import katex from "katex";
    import "katex/dist/katex.min.css";

    let katexInput = "Q_n(f) := \\int_a^b p_n(x) \\, dx = \\sum_{i=0}^n \\underbrace{\\left( \\int_a^b L_i^n(x_i) \\, dx \\right)}_{=:w_i} f(x_i)"; // Example is: Interpolatorische Quadraturformeln
    $: katexResult = katex.renderToString(katexInput, {
            throwOnError: false,
            displayMode: true, // Sets non-inline display
    });

</script>

<svelte:head>
    <title>KaTeX Renderer</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>KaTeX Renderer</h1>
    </div>
</div>

<div class="row pb-5">
    <div class="col">
        <div class="form-group">
            <label for="inputText">KaTeX Math Expression:</label>
            <input type="text" class="form-control font-monospace" bind:value="{katexInput}">
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="d-flex justify-content-center">
            <div class="latex-result">{@html katexResult}</div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://www.npmjs.com/package/katex" target="_blank">KaTeX Library on npm</a></li>
        </ul>
    </div>
</div>

<style>
    .latex-result {
        font-size: 2.5em;
        padding: 10px;
    }
</style>