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

    let baseCaloricIntakePerDay = 2_000;
    const weightChangeCategories = {
        "Extreme weight loss": -1000,
        "Weight loss": -500,
        "Mild weight loss": -250,
        "Maintain weight": 0,
        "Mild weight gain": 250,
        "Weight gain": 500,
        "Fast weight gain": 1000,
    };

    const kcalPerDay = "\\frac{kcal}{day}";

    let caloriesToDistribute = 2_000;

    const calorieDistributions = [
        [60, 25, 15],
        [60, 20, 20],
        [40, 30, 30],
        [40, 40, 20],
        [50, 25, 25],
    ];
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
                    <td><input type="number" class="form-control" bind:value={massKg} min="1"/></td>
                </tr>
                <tr>
                    <td>Height (cm):</td>
                    <td><input type="number" class="form-control" bind:value={heightCm} min="1"/></td>
                </tr>
                <tr>
                    <td>Age (Years):</td>
                    <td><input type="number" class="form-control" bind:value={ageYears} min="1"/></td>
                </tr>
                <tr>
                    <td>Body Fat (%):</td>
                    <td><input type="number" class="form-control" bind:value={bodyFatPercentageDecimal} min="0"/></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>Weight loss and Gain Approximations</h2>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Diff. ({@html katexAsHtmlInline("kcal")})</th>
                    <th scope="col">Daily Calories ({@html katexAsHtmlInline(kcalPerDay)})</th>
                    <th scope="col">Diff. (%)</th>
                </tr>
            </thead>
            <tbody>
                {#each Object.entries(weightChangeCategories) as [label, calDiff]}
                    <tr>
                        <td>{label}</td>
                        <td>{calDiff}</td>
                        <td>{baseCaloricIntakePerDay-calDiff}</td>
                        <td>{(100 * ((baseCaloricIntakePerDay+calDiff)/baseCaloricIntakePerDay)).toFixed(0)}%</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <div class="col-auto">
        Base Caloric Intake (kcal/day):
        <input type="number" class="form-control" bind:value={baseCaloricIntakePerDay} min="0"/>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>Macronutrient Distribution</h2>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <table class="table table-bordered text-center">
            <thead>
                <tr>
                    <th scope="col" colspan="3">Distribution</th>
                    <th scope="col" colspan="3">kcals</th>
                    <th scope="col" colspan="3">g</th>
                </tr>
                <tr>
                    <th scope="col">Carbs</th>
                    <th scope="col">Protein</th>
                    <th scope="col">Fat</th>
                    <th scope="col">Carbs</th>
                    <th scope="col">Protein</th>
                    <th scope="col">Fat</th>
                    <th scope="col">Carbs</th>
                    <th scope="col">Protein</th>
                    <th scope="col">Fat</th>
                </tr>
            </thead>
            <tbody class="table-group-divider">
                {#each calorieDistributions as d}
                <tr>
                    <td>{d[0]}%</td>
                    <td>{d[1]}%</td>
                    <td>{d[2]}%</td>
                    <td>{(caloriesToDistribute * d[0]/100).toFixed(0)}</td>
                    <td>{(caloriesToDistribute * d[1]/100).toFixed(0)}</td>
                    <td>{(caloriesToDistribute * d[2]/100).toFixed(0)}</td>
                    <td>{(1/4 * caloriesToDistribute * d[0]/100).toFixed(0)}</td>
                    <td>{(1/4 * caloriesToDistribute * d[1]/100).toFixed(0)}</td>
                    <td>{(1/9 * caloriesToDistribute * d[2]/100).toFixed(0)}</td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <div class="col-auto">
        Calories to distribute:
        <input type="number" class="form-control" bind:value={caloriesToDistribute} min="0"/>
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