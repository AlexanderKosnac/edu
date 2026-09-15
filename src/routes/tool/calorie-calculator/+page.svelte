<script>
    import { katexAsHtml, katexAsHtmlInline } from "$lib/katexUtility.js";

    let massKg = $state(80);
    let heightCm = $state(180);
    let ageYears = $state(25);
    let bodyFatPercentageDecimal = $state(20);
    let bodyFatPercentageFractional = $derived(bodyFatPercentageDecimal / 100);

    let mifflinBmrMen = $derived(10 * massKg + 6.25 * heightCm - 5 * ageYears + 5);
    let mifflinBmrWomen = $derived(10 * massKg + 6.25 * heightCm - 5 * ageYears - 161);

    let harrisBmrMen = $derived(13.397 * massKg + 4.799 * heightCm - 5.677 * ageYears + 88.362);
    let harrisBmrWomen = $derived(9.247 * massKg + 3.098 * heightCm - 4.330 * ageYears + 447.593);

    let katchBmr = $derived(370 + 21.6 * (1 - bodyFatPercentageFractional) * massKg);

    let mifflinTdeeMen = $derived(mifflinBmrMen * selectedActivityFactor);
    let mifflinTdeeWomen = $derived(mifflinBmrWomen * selectedActivityFactor);

    let harrisTdeeMen = $derived(harrisBmrMen * selectedActivityFactor);
    let harrisTdeeWomen = $derived(harrisBmrWomen * selectedActivityFactor);

    let katchTdee = $derived(katchBmr * selectedActivityFactor);

    let selectedActivity = $state("moderate");
    let customActivityFactor = $state(1.0);

    const activityFactors = {
        bmr: 1.0,
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.465,
        active: 1.55,
        very: 1.725,
        extra: 1.9,
    };

    let selectedActivityFactor = $derived(selectedActivity === "custom" ? customActivityFactor : activityFactors[selectedActivity]);

    let baseCaloricIntakePerDay = $state(2_000);
    const weightChangeCategories = {
        "Extreme weight loss": -1_000,
        "Weight loss": -500,
        "Mild weight loss": -250,
        "Maintain weight": 0,
        "Mild weight gain": 250,
        "Weight gain": 500,
        "Fast weight gain": 1_000,
    };

    const kcalPerDay = "\\frac{kcal}{day}";

    let caloriesToDistribute = $state(2_000);

    let customDistribution = $state([60, 25, 15]);

    const calorieDistributions = [
        [60, 25, 15],
        [60, 20, 20],
        [50, 25, 25],
        [50, 30, 20],
        [40, 30, 30],
        [40, 40, 20],
    ];
</script>

<div class="row">
    <div class="col">
        <h2>Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE)</h2>

        The rate of energy expenditure per unit of time by a human at rest, typically measured in {@html katexAsHtmlInline(kcalPerDay)}.
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <table class="table table-bordered w-auto mt-1">
            <tbody>
                <tr>
                    <th colspan="4" class="text-center">BMR</th>
                </tr>
                <tr>
                    <th></th>
                    <th>Mifflin-St Jeor</th>
                    <th>Revised Harris-Benedict</th>
                    <th>Katch-McArdle</th>
                </tr>
                <tr>
                    <td class="align-middle">Men</td>
                    <td>{@html katexAsHtml(`${mifflinBmrMen.toFixed(1)}`)}</td>
                    <td>{@html katexAsHtml(`${harrisBmrMen.toFixed(1)}`)}</td>
                    <td class="align-middle" rowspan="2">{@html katexAsHtml(`${katchBmr.toFixed(1)}`)}</td>
                </tr>
                <tr>
                    <td class="align-middle">Women</td>
                    <td>{@html katexAsHtml(`${mifflinBmrWomen.toFixed(1)}`)}</td>
                    <td>{@html katexAsHtml(`${harrisBmrWomen.toFixed(1)}`)}</td>
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
                    <td><input type="number" class="form-control" bind:value={bodyFatPercentageDecimal} min="0" max="100"/></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <table class="table table-bordered w-auto mt-1">
            <tbody>
                <tr>
                    <th colspan="4" class="text-center">TDEE</th>
                </tr>
                <tr>
                    <th></th>
                    <th>Mifflin-St Jeor</th>
                    <th>Revised Harris-Benedict</th>
                    <th>Katch-McArdle</th>
                </tr>
                <tr>
                    <td class="align-middle">Men</td>
                    <td>{@html katexAsHtml(`${mifflinTdeeMen.toFixed(1)}`)}</td>
                    <td>{@html katexAsHtml(`${harrisTdeeMen.toFixed(1)}`)}</td>
                    <td class="align-middle" rowspan="2">{@html katexAsHtml(`${katchTdee.toFixed(1)}`)}</td>
                </tr>
                <tr>
                    <td class="align-middle">Women</td>
                    <td>{@html katexAsHtml(`${mifflinTdeeWomen.toFixed(1)}`)}</td>
                    <td>{@html katexAsHtml(`${harrisTdeeWomen.toFixed(1)}`)}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="col-auto">
        <table class="calorie-inputs">
            <tbody>
                <tr>
                    <td>Activity:</td>
                    <td>
                        <select class="form-select" bind:value={selectedActivity}>
                            {#each Object.entries(activityFactors) as [name, factor]}
                                <option value={name}>{name} ({factor})</option>
                            {/each}
                            <option value="custom">Custom</option>
                        </select>
                    </td>
                </tr>

                {#if selectedActivity === "custom"}
                    <tr>
                        <td>Factor:</td>
                        <td><input type="number" class="form-control" bind:value={customActivityFactor} min="0" step="0.01" /></td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>

<div class="row">
    <div class="col">
        <h2>Weight Loss and Gain Approximations</h2>
    </div>
</div>

<div class="row">
    <div class="col-auto">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Calorie Change ({@html katexAsHtmlInline("kcal")})</th>
                    <th scope="col">Target Daily Intake ({@html katexAsHtmlInline(kcalPerDay)})</th>
                    <th scope="col">Percent of Maintenance (%)</th>
                </tr>
            </thead>
            <tbody>
                {#each Object.entries(weightChangeCategories) as [label, calDiff]}
                    <tr>
                        <td>{label}</td>
                        <td>{calDiff}</td>
                        <td>{baseCaloricIntakePerDay + calDiff}</td>
                        <td>{(100 * ((baseCaloricIntakePerDay + calDiff) / baseCaloricIntakePerDay)).toFixed(0)}%</td>
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

{#snippet calculatedDistribution(distribution)}
<td>{(caloriesToDistribute * distribution[0]/100).toFixed(0)}</td>
<td>{(caloriesToDistribute * distribution[1]/100).toFixed(0)}</td>
<td>{(caloriesToDistribute * distribution[2]/100).toFixed(0)}</td>
<td>{(1/4 * caloriesToDistribute * distribution[0]/100).toFixed(0)}</td>
<td>{(1/4 * caloriesToDistribute * distribution[1]/100).toFixed(0)}</td>
<td>{(1/9 * caloriesToDistribute * distribution[2]/100).toFixed(0)}</td>
{/snippet}

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
                    {@render calculatedDistribution(d)}
                </tr>
                {/each}
                <tr>
                    <td><input type="number" class="form-control" min="0" max="100" style="width: 5em" bind:value={customDistribution[0]}/></td>
                    <td><input type="number" class="form-control" min="0" max="100" style="width: 5em" bind:value={customDistribution[1]}/></td>
                    <td><input type="number" class="form-control" min="0" max="100" style="width: 5em" bind:value={customDistribution[2]}/></td>
                    {@render calculatedDistribution(customDistribution)}
                </tr>
            </tbody>
        </table>
    </div>
    <div class="col-auto">
        Calories to distribute:
        <input type="number" class="form-control" bind:value={caloriesToDistribute} min="0"/>
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