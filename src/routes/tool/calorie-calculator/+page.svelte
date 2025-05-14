<script>
    import { katexAsHtml } from "$lib/katexUtility.js";

    let massKg = 80; // W
    let heightCm = 180; // H
    let ageYears = 25; // A
    let bodyFatPercentageDecimal = 20; // F
    $: bodyFatPercentageFractional = bodyFatPercentageDecimal / 100; // F

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
        <div class="mb-2">
            <label>
                Mass (kg):
                <input type="number" class="form-control" bind:value={massKg} min="1"/>
            </label>
            <label>
                Height (cm):
                <input type="number" class="form-control" bind:value={heightCm} min="1"/>
            </label>
            <label>
                Age (Years):
                <input type="number" class="form-control" bind:value={ageYears} min="1"/>
            </label>
            <label>
                Body Fat (%):
                <input type="number" class="form-control" bind:value={bodyFatPercentageDecimal} min="0"/>
            </label>
        </div>

        <div>
            <h2>Base Metabolic Rate (BMR)</h2>

            <table class="table table-bordered w-auto mt-1">
                <tbody>
                    <tr>
                        <th colspan="3">Mifflin-St Jeor Equation:</th>
                    </tr>
                    <tr>
                        <td class="align-middle">Men</td>
                        <td>{@html katexAsHtml("10 * W + 6.25 * H - 5 * A + 5")}</td>
                        <td>{@html katexAsHtml(`${mifflingResultMen.toFixed(3)} ${kcalPerDay}`)}</td>
                    </tr>
                    <tr>
                        <td class="align-middle">Women</td>
                        <td>{@html katexAsHtml("10 * W + 6.25 * H - 5 * A - 161")}</td>
                        <td>{@html katexAsHtml(`${mifflingResultWomen.toFixed(3)} ${kcalPerDay}`)}</td>
                    </tr>

                    <tr>
                        <th colspan="3">Revised Harris-Benedict Equation:</th>
                    </tr>
                    <tr>
                        <td class="align-middle">Men</td>
                        <td>{@html katexAsHtml("13.397 * W + 4.799 * H - 5.677 * A + 88.362")}</td>
                        <td>{@html katexAsHtml(`${harrisResultMen.toFixed(3)} ${kcalPerDay}`)}</td>
                    </tr>
                    <tr>
                        <td class="align-middle">Women</td>
                        <td>{@html katexAsHtml("9.247 * W + 3.098 * H - 4.330 * A + 447.593")}</td>
                        <td>{@html katexAsHtml(`${harrisResultWomen.toFixed(3)} ${kcalPerDay}`)}</td>
                    </tr>

                    <tr>
                        <th colspan="3">Katch-McArdle Formula:</th>
                    </tr>
                    <tr>
                        <td></td>
                        <td>{@html katexAsHtml("370 + 21.6 * (1 - F) * W")}</td>
                        <td>{@html katexAsHtml(`${katchResult.toFixed(3)} ${kcalPerDay}`)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
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
</style>