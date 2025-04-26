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
    $: bmiCalculationKatex = katexAsHtml(`\\text{BMI} = \\frac{mass_{kg}}{height_{m}^2} = \\frac{${massKg}}{${heightM}^2} = ${bmiBasic.toFixed(2)} \\frac{kg}{m^2}`);
    $: bmiBasicCategory = getBmiCategory(bmiBasic);

    $: corpulenceIndex = massKg/(heightM**2);

    $: bmiNew = 1.3 * massKg/(heightM**2.5);

    let bmiPrimeReference = 25;
    $: bmiPrime = bmiBasic/bmiPrimeReference

    let bodySurfaceArea = 0;
    let verticalTrunkCircumference = 0;
    let waistCircumference = 0;
    let height = 0;
    $: surfaceBasedBodyShapeIndex = (height**(7/4) * waistCircumference**(5/6))/(bodySurfaceArea*verticalTrunkCircumference);
    $: surfaceBasedBodyShapeIndexStar = (height**2 * waistCircumference)/(bodySurfaceArea*verticalTrunkCircumference);
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
        {@html bmiCalculationKatex}
        {bmiBasicCategory}
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
</style>