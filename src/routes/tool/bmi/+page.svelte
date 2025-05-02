<script>
    import { katexAsHtml } from "$lib/katexUtility.js";

    let bmiBasicCategorization = [
        { category: "Underweight (Severe thinness)", min: -Infinity, max: 16 },
        { category: "Underweight (Moderate thinness)", min: 16, max: 17 },
        { category: "Underweight (Mild thinness)", min: 17, max: 18 },
        { category: "Normal range", min: 18, max: 25 },
        { category: "Overweight (Pre-obese)", min: 25, max: 30 },
        { category: "Obese (Class I)", min: 30, max: 35 },
        { category: "Obese (Class II)", min: 35, max: 40 },
        { category: "Obese (Class III)", min: 40, max: Infinity },
    ];

    function getBmiCategory(bmi) {
        return bmiBasicCategorization.find(entry => bmi >= entry.min && bmi <= entry.max)?.category ?? "Unknown";
    }

    let massKg = 80;
    let heightCm = 180;
    $: heightM = heightCm/100;

    $: bmiBasic = massKg/(heightM**2);
    $: bmiBasicCalculationKatex = `\\frac{mass_{kg}}{height_{m}^2} = \\frac{${massKg}}{${heightM}^2} = ${bmiBasic.toFixed(2)} \\frac{kg}{m^2}`;
    $: bmiBasicCategory = getBmiCategory(bmiBasic);

    $: corpulenceIndex = massKg/(heightM**3);
    $: corpulenceIndexCalculationKatex = `\\frac{mass_{kg}}{height_{m}^3} = \\frac{${massKg}}{${heightM}^3} = ${corpulenceIndex.toFixed(2)} \\frac{kg}{m^3}`;

    $: bmiNew = 1.3 * massKg/(heightM**2.5);
    $: bmiNewCalculationKatex = `1.3 * \\frac{mass_{kg}}{height_{m}^{2.5}} = 1.3 * \\frac{${massKg}}{${heightM}^{2.5}} = ${bmiNew.toFixed(2)} \\frac{kg}{m^{2.5}}`;

    let bmiPrimeReference = 25;
    $: bmiPrime = bmiBasic/bmiPrimeReference;
    $: bmiPrimeCalculationKatex = `\\frac{\\text{BMI}}{${bmiPrimeReference}} = ${bmiPrime.toFixed(5)}`;

    let bodySurfaceAreaCm2 = 20_000;
    let verticalTrunkCircumferenceCm = 160;
    let waistCircumferenceCm = 89;

    $: surfaceBasedBodyShapeIndex = ((heightCm**(7.0/4.0)) * (waistCircumferenceCm**(5.0/6.0))) / (bodySurfaceAreaCm2 * verticalTrunkCircumferenceCm);
    $: surfaceBasedBodyShapeIndexCalculationKatex = `\\frac{\\text{H}^{7/4} * \\text{WC}^{5/6}}{\\text{BSA} * \\text{VTC}} = \\frac{${heightCm}^{7/4} * ${waistCircumferenceCm}^{5/6}}{${bodySurfaceAreaCm2} * ${verticalTrunkCircumferenceCm}} = ${surfaceBasedBodyShapeIndex.toFixed(2)}`;

    $: surfaceBasedBodyShapeIndexStar = (heightCm**2 * waistCircumferenceCm) / (bodySurfaceAreaCm2 * verticalTrunkCircumferenceCm);
    $: surfaceBasedBodyShapeIndexStarCalculationKatex = `\\frac{\\text{H}^2 * \\text{WC}}{\\text{BSA} * \\text{VTC}} = \\frac{${heightCm}^2 * ${waistCircumferenceCm}}{${bodySurfaceAreaCm2} * ${verticalTrunkCircumferenceCm}} = ${surfaceBasedBodyShapeIndexStar.toFixed(2)}`;
</script>

<svelte:head>
    <title>Body Mass Index (BMI)</title>
</svelte:head>

<div class="row">
    <div class="col">
        <h1>Body Mass Index (BMI)</h1>
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
        </div>

        <div class="">
            <label>
                Body Surface Area (kg):
                <input type="number" class="form-control" bind:value={bodySurfaceAreaCm2} min="1"/>
            </label>
            <label>
                Vertical Trunk Circumference (cm):
                <input type="number" class="form-control" bind:value={verticalTrunkCircumferenceCm} min="1"/>
            </label>
            <label>
                Waist Circumference (cm):
                <input type="number" class="form-control" bind:value={waistCircumferenceCm} min="1"/>
            </label>
        </div>
        <small class="form-text text-muted">Only required for SBSI and variants.</small>
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
                    <th>Info</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>BMI</th>
                    <td>{@html katexAsHtml(`${bmiBasic.toFixed(3)}`)}</td>
                    <td>{@html katexAsHtml(bmiBasicCalculationKatex)}</td>
                    <td>{bmiBasicCategory}</td>
                </tr>
                <tr>
                    <th>Corpulence Index</th>
                    <td>{@html katexAsHtml(`${corpulenceIndex.toFixed(3)}`)}</td>
                    <td>{@html katexAsHtml(corpulenceIndexCalculationKatex)}</td>
                    <td></td>
                </tr>
                <tr>
                    <th>New BMI</th>
                    <td>{@html katexAsHtml(`${bmiNew.toFixed(3)}`)}</td>
                    <td>{@html katexAsHtml(bmiNewCalculationKatex)}</td>
                    <td></td>
                </tr>
                <tr>
                    <th>BMI prime</th>
                    <td>{@html katexAsHtml(`${bmiPrime.toFixed(3)}`)}</td>
                    <td>{@html katexAsHtml(bmiPrimeCalculationKatex)}</td>
                    <td></td>
                </tr>
                <tr>
                    <th>Surface-based body shape index (SBSI)</th>
                    <td>{@html katexAsHtml(`${surfaceBasedBodyShapeIndex.toFixed(3)}`)}</td>
                    <td>{@html katexAsHtml(surfaceBasedBodyShapeIndexCalculationKatex)}</td>
                    <td></td>
                </tr>
                <tr>
                    <th>Surface-based body shape index star (SBSI*)</th>
                    <td>{@html katexAsHtml(`${surfaceBasedBodyShapeIndexStar.toFixed(3)}`)}</td>
                    <td>{@html katexAsHtml(surfaceBasedBodyShapeIndexStarCalculationKatex)}</td>
                    <td></td>
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