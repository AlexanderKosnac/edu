<script>
    import { katexAsHtml } from "$lib/katexUtility.js";

    let massKg = 80;
    let heightCm = 180;
    $: heightM = heightCm/100;

    function factorAndHeightAndWeightExponential(factor, heightExp, weightExp) {
        const value = factor * heightCm**heightExp * massKg**weightExp;
        return {
            value: factor * heightCm**heightExp * massKg**weightExp,
            katex: `${factor} * ${heightCm}^{${heightExp}} * ${massKg}^{${weightExp}} = ${value.toFixed(2)}`,
        }
    }

    $: duBois = factorAndHeightAndWeightExponential(0.007184, 0.725, 0.425);

    $: mosteller = ((heightCm * massKg)/3600)**0.5;
    $: mostellerCalculationKatex = katexAsHtml(`\\sqrt{\\frac{${heightCm} * ${massKg}}{3600}} = ${mosteller.toFixed(2)}`);

    $: haycock = factorAndHeightAndWeightExponential(0.024265, 0.3964, 0.5378);

    $: gehanAndGeorge = factorAndHeightAndWeightExponential(0.0235, 0.42246, 0.51456);
</script>

<svelte:head>
    <title>Body Surface Area</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Body Surface Area</h1>
    </div>
</div>

<div class="row">
    <div class="col">            
        <div class="d-flex gap-1">
            <label>
                Mass (kg):
                <input type="number" class="form-control" bind:value={massKg} min="1"/>
            </label>
            <label>
                Height (cm):
                <input type="number" class="form-control" bind:value={heightCm} min="1"/>
            </label>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <table class="table table-bordered w-auto mt-1">
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>Calculation</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>DuBois Formula</th>
                    <td>{@html katexAsHtml(`${duBois.value.toFixed(3)} \\text{ m}^2`)}</td>
                    <td>{@html katexAsHtml(duBois.katex)}</td>
                </tr>
                <tr>
                    <th>Mosteller</th>
                    <td>{@html katexAsHtml(`${mosteller.toFixed(3)} \\text{ m}^2`)}</td>
                    <td>{@html mostellerCalculationKatex}</td>
                </tr>
                <tr>
                    <th>Haycock</th>
                    <td>{@html katexAsHtml(`${haycock.value.toFixed(3)} \\text{ m}^2`)}</td>
                    <td>{@html katexAsHtml(haycock.katex)}</td>
                </tr>
                <tr>
                    <th>Gehan and George</th>
                    <td>{@html katexAsHtml(`${gehanAndGeorge.value.toFixed(3)} \\text{ m}^2`)}</td>
                    <td>{@html katexAsHtml(gehanAndGeorge.katex)}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Body_mass_index" target="_blank">Body mass index</a></li>
            <li><a href="https://de.wikipedia.org/wiki/DuBois-Formel" target="_blank">DuBois-Formel</a></li>
        </ul>
    </div>
</div>

<style>
    td, th {
        vertical-align: middle;
    }
</style>