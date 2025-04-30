<script>
    import { katexAsHtml } from "$lib/katexUtility.js";

    let massKg = 80;
    let heightCm = 180;
    $: heightM = heightCm/100;

    $: duBois = 0.007184 * heightCm**0.725 * massKg**0.425;
    $: duBoisCalculationKatex = katexAsHtml(`0.007184 * ${heightCm}^{0.725} * ${massKg}^{0.425} = ${duBois.toFixed(2)}`);
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
                    <td>{@html katexAsHtml(`${duBois.toFixed(3)} \\text{ m}^2`)}</td>
                    <td>{@html duBoisCalculationKatex}</td>
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