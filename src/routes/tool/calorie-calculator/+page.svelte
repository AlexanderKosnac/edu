<script>
    import { katexAsHtml, katexAsHtmlInline } from "$lib/katexUtility.js";

    let massKg = 80;
    let heightCm = 180;
    let ageYears = 25;
    let bodyFatPercentageDecimal = 20;
    $: bodyFatPercentageFractional = bodyFatPercentageDecimal / 100;

    $: mifflingResultMen = 10 * massKg + 6.25 * heightCm - 5 * ageYears + 5;
    $: mifflingResultWomen = 10 * massKg + 6.25 * heightCm - 5 * ageYears - 161;

    $: harrisResultMen = 13.397 * massKg + 4.799 * heightCm - 5.677 * ageYears + 88.362;
    $: harrisResultWomen = 9.247 * massKg + 3.098 * heightCm - 4.330 * ageYears + 447.593;

    $: katchResult = 370 + 21.6 * (1 - bodyFatPercentageFractional) * massKg;

    const kcalPerDay = "\\frac{kcal}{day}";
</script>

<svelte:head>
    <title>Calorie Calculator</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Calorie Calculator</h1>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>Basal Metabolic Rate (BMR)</h2>

        The rate of energy expenditure per unit of time by a human at rest, typically measured in {@html katexAsHtmlInline(kcalPerDay)}.
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <table class="table table-bordered w-auto mt-1">
            <tbody>
                <tr>
                    <th></th>
                    <th>Mifflin-St Jeor</th>
                    <th>Revised Harris-Benedict</th>
                    <th>Katch-McArdle</th>
                </tr>
                <tr>
                    <td class="align-middle">Men</td>
                    <td>{@html katexAsHtml(`${mifflingResultMen.toFixed(1)}`)}</td>
                    <td>{@html katexAsHtml(`${harrisResultMen.toFixed(1)}`)}</td>
                    <td class="align-middle" rowspan="2">{@html katexAsHtml(`${katchResult.toFixed(1)}`)}</td>
                </tr>
                <tr>
                    <td class="align-middle">Women</td>
                    <td>{@html katexAsHtml(`${mifflingResultWomen.toFixed(1)}`)}</td>
                    <td>{@html katexAsHtml(`${harrisResultWomen.toFixed(1)}`)}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="col-auto">
        <table class="calorie-inputs">
            <tbody>
                <tr>
                    <td>Mass (kg):</td>
                    <td><input type="number" id="mass" class="form-control" bind:value={massKg} min="1"/></td>
                </tr>
                <tr>
                    <td>Height (cm):</td>
                    <td><input type="number" id="" class="form-control" bind:value={heightCm} min="1"/></td>
                </tr>
                <tr>
                    <td>Age (Years):</td>
                    <td><input type="number" id="" class="form-control" bind:value={ageYears} min="1"/></td>
                </tr>
                <tr>
                    <td>Body Fat (%):</td>
                    <td><input type="number" id="" class="form-control" bind:value={bodyFatPercentageDecimal} min="0"/></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>References:</h2>
        <ul>
            <li><a href="https://en.wikipedia.org/wiki/Calorie" target="_blank">Calorie</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Basal_metabolic_rate" target="_blank">Basal metabolic rate</a></li>
        </ul>
    </div>
</div>

<style>
.calorie-inputs {
    border-collapse: separate;
    border-spacing: 10px 0;
}

.calorie-inputs input {
    width: 6em;
}
</style>