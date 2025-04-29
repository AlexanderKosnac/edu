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
    $: bmiBasicCalculationKatex = katexAsHtml(`\\frac{mass_{kg}}{height_{m}^2} = \\frac{${massKg}}{${heightM}^2} = ${bmiBasic.toFixed(2)} \\frac{kg}{m^2}`);
    $: bmiBasicCategory = getBmiCategory(bmiBasic);

    $: corpulenceIndex = massKg/(heightM**3);
    $: corpulenceIndexCalculationKatex = katexAsHtml(`\\frac{mass_{kg}}{height_{m}^3} = \\frac{${massKg}}{${heightM}^3} = ${corpulenceIndex.toFixed(2)} \\frac{kg}{m^3}`);

    $: bmiNew = 1.3 * massKg/(heightM**2.5);
    $: bmiNewCalculationKatex = katexAsHtml(`1.3 * \\frac{mass_{kg}}{height_{m}^{2.5}} = 1.3 * \\frac{${massKg}}{${heightM}^{2.5}} = ${bmiNew.toFixed(2)} \\frac{kg}{m^{2.5}}`);

    let bmiPrimeReference = 25;
    $: bmiPrime = bmiBasic/bmiPrimeReference;
    $: bmiPrimeCalculationKatex = katexAsHtml(`\\frac{\\text{BMI}}{${bmiPrimeReference}} = ${bmiPrime.toFixed(5)}`);

    let bodySurfaceArea = 0;
    let verticalTrunkCircumference = 0;
    let waistCircumference = 0;
    let height = 0;

    $: surfaceBasedBodyShapeIndex = (height**(7/4) * waistCircumference**(5/6))/(bodySurfaceArea*verticalTrunkCircumference);
    $: surfaceBasedBodyShapeIndexCalculationKatex = katexAsHtml(`\\frac{\\text{H}^{7/4} * \\text{WC}^{5/6}}{\\text{BSA} * \\text{VTC}} = \\frac{${height}^{7/4} * ${waistCircumference}^{5/6}}{${bodySurfaceArea} * ${verticalTrunkCircumference}} = ${surfaceBasedBodyShapeIndex.toFixed(2)}`);

    $: surfaceBasedBodyShapeIndexStar = (height**2 * waistCircumference)/(bodySurfaceArea*verticalTrunkCircumference);
    $: surfaceBasedBodyShapeIndexStarCalculationKatex = katexAsHtml(`\\frac{\\text{H}^2 * \\text{WC}}{\\text{BSA} * \\text{VTC}} = \\frac{${height}^2 * ${waistCircumference}}{${bodySurfaceArea} * ${verticalTrunkCircumference}} = ${surfaceBasedBodyShapeIndexStar.toFixed(2)}`);
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
                    <th>Info</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>BMI</th>
                    <td>{@html katexAsHtml(`${bmiBasic.toFixed(3)}`)}</td>
                    <td>{@html bmiBasicCalculationKatex}</td>
                    <td>{bmiBasicCategory}</td>
                </tr>
                <tr>
                    <th>Corpulence Index</th>
                    <td>{@html katexAsHtml(`${corpulenceIndex.toFixed(3)}`)}</td>
                    <td>{@html corpulenceIndexCalculationKatex}</td>
                    <td></td>
                </tr>
                <tr>
                    <th>New BMI</th>
                    <td>{@html katexAsHtml(`${bmiNew.toFixed(3)}`)}</td>
                    <td>{@html bmiNewCalculationKatex}</td>
                    <td></td>
                </tr>
                <tr>
                    <th>BMI prime</th>
                    <td>{@html katexAsHtml(`${bmiPrime.toFixed(3)}`)}</td>
                    <td>{@html bmiPrimeCalculationKatex}</td>
                    <td></td>
                </tr>
                <tr>
                    <th>Surface-based body shape index (SSBI)</th>
                    <td>{@html katexAsHtml(`${surfaceBasedBodyShapeIndex.toFixed(3)}`)}</td>
                    <td>{@html surfaceBasedBodyShapeIndexCalculationKatex}</td>
                    <td></td>
                </tr>
                <tr>
                    <th>Surface-based body shape index star (SSBI*)</th>
                    <td>{@html katexAsHtml(`${surfaceBasedBodyShapeIndexStar.toFixed(3)}`)}</td>
                    <td>{@html surfaceBasedBodyShapeIndexStarCalculationKatex}</td>
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
        </ul>
    </div>
</div>

<style>
    td, th {
        vertical-align: middle;
    }
</style>